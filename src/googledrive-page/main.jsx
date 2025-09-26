import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

// Internal components
import CredentialsForm from './components/CredentialsForm';
import AuthSection from './components/AuthSection';
import FileUpload from './components/FileUpload';
import FolderCreator from './components/FolderCreator';
import FilesList from './components/FilesList';

// Import main styles
import './scss/style.scss';

const GoogleDriveTestApp = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(wpmudevDriveTest.authStatus);
	const [hasCredentials, setHasCredentials] = useState(wpmudevDriveTest.hasCredentials);
	const [files, setFiles] = useState([]);
	const [nextPageToken, setNextPageToken] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const loadFiles = useCallback(async () => {
		if (!isAuthenticated) return;

		setIsLoading(true);
		setError('');

		try {
			const response = await apiFetch({
				path: `${wpmudevDriveTest.restEndpointFiles}?page_size=20`,
				method: 'GET',
			});

			setFiles(response.files || []);
			setNextPageToken(response.nextPageToken || '');
		} catch (err) {
			setError(err.message || __('Failed to load files', 'wpmudev-plugin-test'));
		} finally {
			setIsLoading(false);
		}
	}, [isAuthenticated]);

	const handleAuth = async () => {
		try {
			const response = await apiFetch({
				path: wpmudevDriveTest.restEndpointAuth,
				method: 'POST',
				data: {
					_wpnonce: wpmudevDriveTest.nonce,
				},
			});

			if (response.auth_url) {
				window.location.href = response.auth_url;
			} else {
				console.error('No auth URL received');
			}
		} catch (err) {
			setError(err.message || __('Failed to start authentication', 'wpmudev-plugin-test'));
		}
	};

	const handleDownload = async (fileId) => {
		try {
			// Get the download URL from our backend
			const response = await apiFetch({
				path: `${wpmudevDriveTest.restEndpointDownloadUrl}?file_id=${fileId}`,
				method: 'GET',
			});

			if (response.success && response.download_url) {
				// Create a temporary link with the Google Drive URL and access token
				const link = document.createElement('a');
				link.href = response.download_url;
				link.download = response.filename || 'download';
				link.style.display = 'none';
				
				// Add authorization header by creating a fetch request
				fetch(response.download_url, {
					headers: {
						'Authorization': `Bearer ${response.access_token}`
					}
				}).then(res => res.blob()).then(blob => {
					const url = window.URL.createObjectURL(blob);
					link.href = url;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
					window.URL.revokeObjectURL(url);
				}).catch(err => {
					console.error('Download error:', err);
					setError(__('Failed to download file', 'wpmudev-plugin-test'));
				});
			} else {
				setError(__('Failed to get download URL', 'wpmudev-plugin-test'));
			}
		} catch (err) {
			console.error('Download error:', err);
			setError(err.message || __('Failed to download file', 'wpmudev-plugin-test'));
		}
	};

	const handleCredentialsSaved = () => {
		setHasCredentials(true);
	};

	const handleUploadComplete = () => {
		setFiles([]);
		setNextPageToken('');
		loadFiles();
	};

	const handleFolderCreated = () => {
		setFiles([]);
		setNextPageToken('');
		loadFiles();
	};

	const handleDisconnect = async () => {
		try {
			const response = await apiFetch({
				path: wpmudevDriveTest.restEndpointDisconnect,
				method: 'POST',
				data: {
					_wpnonce: wpmudevDriveTest.nonce,
				},
			});

			if (response.success) {
				setIsAuthenticated(false);
				setFiles([]);
				setError('');
				// Show success message
				console.log(response.message);
			}
		} catch (err) {
			setError(err.message || __('Failed to disconnect from Google Drive', 'wpmudev-plugin-test'));
		}
	};

	useEffect(() => {
		loadFiles();
	}, [loadFiles]);

	return (
		<div className="google-drive-app">
			<div className="sui-wrap">
				<div className="sui-header">
					<h1 className="sui-header-title">
						<span className="sui-icon-cloud" aria-hidden="true"></span>
						{wpmudevDriveTest.i18n.title}
					</h1>
				</div>

				{error && (
					<div className="sui-notice sui-notice-error app-notice">
						<div className="sui-notice-content">
							<div className="sui-notice-message">
								<span className="sui-notice-icon sui-icon-info" aria-hidden="true"></span>
								<p>{error}</p>
							</div>
						</div>
					</div>
				)}

				<div className="sui-row">
					<div className="sui-col-md-6">
						<CredentialsForm
							onSave={handleCredentialsSaved}
							isLoading={isLoading}
							hasCredentials={hasCredentials}
						/>
					</div>
					<div className="sui-col-md-6">
						<AuthSection
							onAuth={handleAuth}
							onDisconnect={handleDisconnect}
							isAuthenticated={isAuthenticated}
							isLoading={isLoading}
						/>
					</div>
				</div>

				{isAuthenticated && (
					<>
						<div className="sui-row">
							<div className="sui-col-md-6">
								<FileUpload
									onUpload={handleUploadComplete}
									onUploadComplete={handleUploadComplete}
								/>
							</div>
							<div className="sui-col-md-6">
								<FolderCreator
									onCreateFolder={handleFolderCreated}
									onFolderCreated={handleFolderCreated}
								/>
							</div>
						</div>

						<div className="sui-row">
							<div className="sui-col-md-12">
								<FilesList
									files={files}
									nextPageToken={nextPageToken}
									isLoading={isLoading}
									onDownload={handleDownload}
									onRefresh={loadFiles}
								/>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

// Initialize the app
const initGoogleDriveTest = () => {
	const rootElement = document.getElementById(wpmudevDriveTest.dom_element_id);
	if (rootElement) {
		const { createRoot } = wp.element;
		const root = createRoot(rootElement);
		root.render(<GoogleDriveTestApp />);
	}
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initGoogleDriveTest);
} else {
	initGoogleDriveTest();
}
