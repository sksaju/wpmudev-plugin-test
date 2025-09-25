import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import '../scss/components/CredentialsForm.scss';

const CredentialsForm = ({ onSave, isLoading, hasCredentials }) => {
	const [clientId, setClientId] = useState('');
	const [clientSecret, setClientSecret] = useState('');
	const [isSaving, setIsSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSaving(true);
		setError('');
		setSuccess('');

		try {
			const response = await apiFetch({
				path: wpmudevDriveTest.restEndpointSave,
				method: 'POST',
				data: {
					client_id: clientId,
					client_secret: clientSecret,
				},
			});

			setSuccess(__('Credentials saved successfully!', 'wpmudev-plugin-test'));
			onSave();
		} catch (err) {
			setError(err.message || __('Failed to save credentials', 'wpmudev-plugin-test'));
		} finally {
			setIsSaving(false);
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
					{hasCredentials && (
						<div className="sui-box-actions">
							<span className="sui-tag sui-tag-success">
								{__('Configured', 'wpmudev-plugin-test')}
							</span>
						</div>
					)}
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
					<form onSubmit={handleSubmit} className="credentials-form__form">
						<div className="sui-form-field">
							<label className="sui-label" htmlFor="client-id">
								{__('Client ID', 'wpmudev-plugin-test')}
							</label>
							<input
								id="client-id"
								type="text"
								className="sui-form-control"
								value={clientId}
								onChange={(e) => setClientId(e.target.value)}
								placeholder={__('Enter your Google Client ID', 'wpmudev-plugin-test')}
								required
							/>
							<span className="sui-description">
								{__('Get this from Google Cloud Console', 'wpmudev-plugin-test')}
							</span>
						</div>
						<div className="sui-form-field">
							<label className="sui-label" htmlFor="client-secret">
								{__('Client Secret', 'wpmudev-plugin-test')}
							</label>
							<input
								id="client-secret"
								type="password"
								className="sui-form-control"
								value={clientSecret}
								onChange={(e) => setClientSecret(e.target.value)}
								placeholder={__('Enter your Google Client Secret', 'wpmudev-plugin-test')}
								required
							/>
							<span className="sui-description">
								{__('Keep this secure and private', 'wpmudev-plugin-test')}
							</span>
						</div>
						<div className="sui-form-field">
							<button
								type="submit"
								className="sui-button sui-button-blue"
								disabled={isSaving || !clientId || !clientSecret}
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
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default CredentialsForm;
