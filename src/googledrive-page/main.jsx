import { useState, useEffect, useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';

// Import components
import CredentialsForm from './components/CredentialsForm';
import AuthSection from './components/AuthSection';
import FileUpload from './components/FileUpload';
import FolderCreator from './components/FolderCreator';
import FilesList from './components/FilesList';

// Import main styles
import './scss/style.scss';

// Main App Component
const GoogleDriveTestApp = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(wpmudevDriveTest.authStatus);
	const [hasCredentials, setHasCredentials] = useState(wpmudevDriveTest.hasCredentials);
	const [files, setFiles] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const loadFiles = useCallback(async () => {
		if (!isAuthenticated) return;

		setIsLoading(true);
		setError('');

		try {
			const response = await apiFetch({
				path: wpmudevDriveTest.restEndpointFiles,
				method: 'GET',
			});

			setFiles(response.files || []);
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
				// Direct redirect to Google OAuth - no popup
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
			const response = await apiFetch({
				path: `${wpmudevDriveTest.restEndpointDownload}?file_id=${fileId}`,
				method: 'GET',
			});

			if (response.download_url) {
				window.open(response.download_url, '_blank');
			}
		} catch (err) {
			setError(err.message || __('Failed to download file', 'wpmudev-plugin-test'));
		}
	};

	const handleCredentialsSaved = () => {
		setHasCredentials(true);
	};

	const handleUploadComplete = () => {
		loadFiles();
	};

	const handleFolderCreated = () => {
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
