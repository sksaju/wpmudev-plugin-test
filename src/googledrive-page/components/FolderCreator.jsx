import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import '../scss/components/FolderCreator.scss';

const FolderCreator = ({ onCreateFolder, onFolderCreated }) => {
	const [folderName, setFolderName] = useState('');
	const [isCreating, setIsCreating] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleCreateFolder = async () => {
		if (!folderName.trim()) return;

		setIsCreating(true);
		setError('');
		setSuccess('');

		try {
			const response = await apiFetch({
				path: wpmudevDriveTest.restEndpointCreate,
				method: 'POST',
				data: {
					name: folderName.trim(),
				},
			});

			setSuccess(__('Folder created successfully!', 'wpmudev-plugin-test'));
			setFolderName('');
			onFolderCreated();

			setTimeout(() => {
				setSuccess('');
			}, 3000);
		} catch (err) {
			setError(err.message || __('Failed to create folder', 'wpmudev-plugin-test'));
		} finally {
			setIsCreating(false);
		}
	};

	return (
		<div className="folder-creator">
			<div className="sui-box">
				<div className="sui-box-header">
					<h3 className="sui-box-title">
						<span className="sui-icon-folder" aria-hidden="true"></span>
						{__('Create New Folder', 'wpmudev-plugin-test')}
					</h3>
				</div>
				<div className="sui-box-body">
					{error && (
						<div className="sui-notice sui-notice-error">
							<div className="sui-notice-content">
								<div className="sui-notice-message">
									<span className="sui-notice-icon sui-icon-info" aria-hidden="true"></span>
									<p>{error}</p>
								</div>
							</div>
						</div>
					)}
					{success && (
						<div className="sui-notice sui-notice-success">
							<div className="sui-notice-content">
								<div className="sui-notice-message">
									<span className="sui-notice-icon sui-icon-check-tick" aria-hidden="true"></span>
									<p>{success}</p>
								</div>
							</div>
						</div>
					)}

					<div className="folder-creator__form">
						<div className="folder-creator__icon">
							<span className="sui-icon-folder" aria-hidden="true"></span>
						</div>

						<div className="sui-form-field">
							<label className="sui-label" htmlFor="folder-name">
								{__('Folder Name', 'wpmudev-plugin-test')}
							</label>
							<input
								id="folder-name"
								type="text"
								className="sui-form-control"
								value={folderName}
								onChange={(e) => setFolderName(e.target.value)}
								placeholder={__('Enter folder name', 'wpmudev-plugin-test')}
								onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
								disabled={isCreating}
							/>
							<span className="sui-description">
								{__('Choose a descriptive name for your new folder', 'wpmudev-plugin-test')}
							</span>
						</div>

						<div className="folder-creator__actions">
							<button
								className="sui-button sui-button-blue"
								onClick={handleCreateFolder}
								disabled={!folderName.trim() || isCreating}
							>
								{isCreating ? (
									<>
										<span className="sui-icon-loader sui-loading" aria-hidden="true"></span>
										{__('Creating...', 'wpmudev-plugin-test')}
									</>
								) : (
									<>
										<span className="sui-icon-plus" aria-hidden="true"></span>
										{__('Create Folder', 'wpmudev-plugin-test')}
									</>
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FolderCreator;
