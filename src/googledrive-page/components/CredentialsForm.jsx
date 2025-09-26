import { useState, useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import '../scss/components/CredentialsForm.scss';

const CredentialsForm = ({ onSave, isLoading, hasCredentials }) => {
	const [clientId, setClientId] = useState('');
	const [clientSecret, setClientSecret] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [showInstructions, setShowInstructions] = useState(false);
	const [isEditing, setIsEditing] = useState(!hasCredentials);

	// Clear success message after 5 seconds
	useEffect(() => {
		if (success) {
			const timer = setTimeout(() => setSuccess(''), 5000);
			return () => clearTimeout(timer);
		}
	}, [success]);

	// Load saved credentials when component mounts
	useEffect(() => {
		if (hasCredentials) {
		// Fetch saved credentials to display
		apiFetch({
			path: wpmudevDriveTest.restEndpointGet,
			method: 'GET',
		}).then((response) => {
				if (response.success && response.credentials) {
					setClientId(response.credentials.client_id || '');
					setClientSecret('******************************'); // Mask the secret
				}
			}).catch((err) => {
				console.error('Failed to load credentials:', err);
			});
		}
	}, [hasCredentials]);

	const validateClientId = (id) => {
		// Google OAuth client IDs typically end with .apps.googleusercontent.com
		return id.includes('.apps.googleusercontent.com') && id.length > 50;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSaving(true);
		setError('');
		setSuccess('');

		// Validate client ID format
		if (!validateClientId(clientId)) {
			setError(__('Invalid Client ID format. Should end with .apps.googleusercontent.com', 'wpmudev-plugin-test'));
			setIsSaving(false);
			return;
		}

		// Validate client secret length
		if (clientSecret.length < 20) {
			setError(__('Client Secret appears to be too short. Please check your credentials.', 'wpmudev-plugin-test'));
			setIsSaving(false);
			return;
		}

		try {
			const response = await apiFetch({
				path: wpmudevDriveTest.restEndpointSave,
				method: 'POST',
				data: {
					client_id: clientId.trim(),
					client_secret: clientSecret.trim(),
					_wpnonce: wpmudevDriveTest.nonce,
				},
			});

			setSuccess(__('Credentials saved successfully! You can now authenticate with Google Drive.', 'wpmudev-plugin-test'));
			setIsEditing(false);
			onSave();
		} catch (err) {
			setError(err.message || __('Failed to save credentials. Please check your Google Cloud Console configuration.', 'wpmudev-plugin-test'));
		} finally {
			setIsSaving(false);
		}
	};

	const handleClearCredentials = async () => {
		if (confirm(__('Are you sure you want to clear the saved credentials?', 'wpmudev-plugin-test'))) {
			setClientId('');
			setClientSecret('');
			setError('');
			setSuccess('');
			setIsEditing(true);
		}
	};

	const handleEditCredentials = () => {
		setIsEditing(true);
		setClientSecret(''); // Clear the masked secret for editing
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		// Reload the saved credentials
		if (hasCredentials) {
			setClientSecret('****');
		}
	};

	return (
		<div className="credentials-form">
			<div className="sui-box">
				<div className="sui-box-header">
					<h3 className="sui-box-title">
						<span className="sui-icon-key" aria-hidden="true"></span>
						{__('Google Drive Credentials', 'wpmudev-plugin-test')}
					</h3>
					<div className="sui-box-actions">
						{hasCredentials && !isEditing && (
							<span className="sui-tag sui-tag-success">
								{__('Configured', 'wpmudev-plugin-test')}
							</span>
						)}
						{hasCredentials && !isEditing && (
							<button
								type="button"
								className="sui-button sui-button-ghost sui-button-sm"
								onClick={handleEditCredentials}
							>
								<span className="sui-icon-pencil" aria-hidden="true"></span>
								{__('Edit', 'wpmudev-plugin-test')}
							</button>
						)}
						<button
							type="button"
							className="sui-button sui-button-ghost sui-button-sm"
							onClick={() => setShowInstructions(!showInstructions)}
						>
							<span className="sui-icon-info" aria-hidden="true"></span>
							{showInstructions ? __('Hide Instructions', 'wpmudev-plugin-test') : __('Show Instructions', 'wpmudev-plugin-test')}
						</button>
					</div>
				</div>
				<div className="sui-box-body">
					{showInstructions && (
						<div className="credentials-form__instructions">
							<div className="sui-notice sui-notice-info">
								<div className="sui-notice-content">
									<div className="sui-notice-message">
										<span className="sui-notice-icon sui-icon-info" aria-hidden="true"></span>
										<div>
											<p><strong>{__('How to get Google Drive credentials:', 'wpmudev-plugin-test')}</strong></p>
											<ol>
												<li>{__('Go to', 'wpmudev-plugin-test')} <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
												<li>{__('Create a new project or select existing one', 'wpmudev-plugin-test')}</li>
												<li>{__('Enable Google Drive API', 'wpmudev-plugin-test')}</li>
												<li>{__('Go to APIs & Services → Credentials', 'wpmudev-plugin-test')}</li>
												<li>{__('Create OAuth 2.0 Client ID (Web application)', 'wpmudev-plugin-test')}</li>
												<li>{__('Add authorized redirect URI:', 'wpmudev-plugin-test')} <code>{wpmudevDriveTest.redirectUri}</code></li>
												<li>{__('Add authorized JavaScript origins:', 'wpmudev-plugin-test')} <code>{window.location.origin}</code></li>
												<li>{__('Copy Client ID and Client Secret', 'wpmudev-plugin-test')}</li>
											</ol>
										</div>
									</div>
								</div>
							</div>
						</div>
					)}

					{error && (
						<div className="sui-notice sui-notice-error">
							<div className="sui-notice-content">
								<div className="sui-notice-message">
									<span className="sui-notice-icon sui-icon-warning-alert" aria-hidden="true"></span>
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
					{isEditing ? (
						<form onSubmit={handleSubmit} className="credentials-form__form">
							<div className="sui-form-field">
								<label className="sui-label" htmlFor="client-id">
									{__('Client ID', 'wpmudev-plugin-test')}
									<span className="sui-label-required">*</span>
								</label>
								<input
									id="client-id"
									type="text"
									className={`sui-form-control ${clientId && !validateClientId(clientId) ? 'sui-form-control-error' : ''}`}
									value={clientId}
									onChange={(e) => setClientId(e.target.value)}
									placeholder={__('e.g., 123456789-abcdefghijklmnop.apps.googleusercontent.com', 'wpmudev-plugin-test')}
									required
								/>
								<span className="sui-description">
									{__('Get this from Google Cloud Console → APIs & Services → Credentials', 'wpmudev-plugin-test')}
								</span>
								{clientId && !validateClientId(clientId) && (
									<span className="sui-description sui-description-error">
										{__('Client ID should end with .apps.googleusercontent.com', 'wpmudev-plugin-test')}
									</span>
								)}
							</div>
							<div className="sui-form-field">
								<label className="sui-label" htmlFor="client-secret">
									{__('Client Secret', 'wpmudev-plugin-test')}
									<span className="sui-label-required">*</span>
								</label>
								<div className="sui-form-control-with-icon">
									<input
										id="client-secret"
										type="password"
										className={`sui-form-control ${clientSecret && clientSecret.length < 20 ? 'sui-form-control-error' : ''}`}
										value={clientSecret}
										onChange={(e) => setClientSecret(e.target.value)}
										placeholder={__('Enter your Google Client Secret', 'wpmudev-plugin-test')}
										required
									/>
									<span className="sui-icon-eye sui-icon-eye-hide" aria-hidden="true"></span>
								</div>
								<span className="sui-description">
									{__('Keep this secure and private. Never share it publicly.', 'wpmudev-plugin-test')}
								</span>
								{clientSecret && clientSecret.length < 20 && (
									<span className="sui-description sui-description-error">
										{__('Client Secret appears to be too short', 'wpmudev-plugin-test')}
									</span>
								)}
							</div>
							<div className="sui-form-field sui-form-field-last">
								<div className="sui-form-field-control">
									<button
										type="submit"
										className="sui-button sui-button-blue"
										disabled={isSaving || !clientId || !clientSecret || !validateClientId(clientId)}
									>
										{isSaving ? (
											<>
												<span className="sui-icon-loader sui-loading" aria-hidden="true"></span>
												{__('Saving...', 'wpmudev-plugin-test')}
											</>
										) : (
											<>
												<span className="sui-icon-save" aria-hidden="true"></span>
												{__('Save Credentials', 'wpmudev-plugin-test')}
											</>
										)}
									</button>
									{hasCredentials && (
										<button
											type="button"
											className="sui-button sui-button-ghost"
											onClick={handleCancelEdit}
											disabled={isSaving}
										>
											<span className="sui-icon-close" aria-hidden="true"></span>
											{__('Cancel', 'wpmudev-plugin-test')}
										</button>
									)}
									{(clientId || clientSecret) && (
										<button
											type="button"
											className="sui-button sui-button-ghost"
											onClick={handleClearCredentials}
											disabled={isSaving}
										>
											<span className="sui-icon-trash" aria-hidden="true"></span>
											{__('Clear', 'wpmudev-plugin-test')}
										</button>
									)}
								</div>
							</div>
						</form>
					) : (
						<div className="credentials-form__display">
							<div className="sui-form-field">
								<label className="sui-label">
									{__('Client ID', 'wpmudev-plugin-test')}
								</label>
								<div className="sui-form-control sui-form-control-display">
									{clientId || __('Not set', 'wpmudev-plugin-test')}
								</div>
							</div>
							<div className="sui-form-field">
								<label className="sui-label">
									{__('Client Secret', 'wpmudev-plugin-test')}
								</label>
								<div className="sui-form-control sui-form-control-display">
									{clientSecret || __('Not set', 'wpmudev-plugin-test')}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default CredentialsForm;
