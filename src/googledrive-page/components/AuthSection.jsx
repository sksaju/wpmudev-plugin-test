import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import '../scss/components/AuthSection.scss';

const AuthSection = ({ onAuth, isAuthenticated, isLoading }) => {
	const [isAuthenticating, setIsAuthenticating] = useState(false);

	const handleAuth = async () => {
		setIsAuthenticating(true);
		try {
			await onAuth();
		} catch (err) {
			console.error('Auth error:', err);
		} finally {
			setIsAuthenticating(false);
		}
	};

	return (
		<div className="auth-section">
			<div className="sui-box">
				<div className="sui-box-header">
					<h3 className="sui-box-title">
						<span className="sui-icon-cloud" aria-hidden="true"></span>
						{__('Authentication', 'wpmudev-plugin-test')}
					</h3>
					{isAuthenticated && (
						<div className="sui-box-actions">
							<span className="sui-tag sui-tag-success">
								{__('Connected', 'wpmudev-plugin-test')}
							</span>
						</div>
					)}
				</div>
				<div className="sui-box-body">
					{isAuthenticated ? (
						<div className="auth-section__success">
							<div className="sui-notice sui-notice-success">
								<div className="sui-notice-content">
									<div className="sui-notice-message">
										<span className="sui-notice-icon sui-icon-check-tick" aria-hidden="true"></span>
										<p>{__('Successfully authenticated with Google Drive!', 'wpmudev-plugin-test')}</p>
									</div>
								</div>
							</div>
							<div className="auth-section__info">
								<p className="sui-description">
									{__('You can now upload files, create folders, and manage your Google Drive content.', 'wpmudev-plugin-test')}
								</p>
							</div>
						</div>
					) : (
						<div className="auth-section__auth">
							<div className="auth-section__icon">
								<span className="sui-icon-cloud" aria-hidden="true"></span>
							</div>
							<div className="auth-section__content">
								<h4>{__('Connect to Google Drive', 'wpmudev-plugin-test')}</h4>
								<p className="sui-description">
									{__('Click the button below to authenticate with Google Drive and start managing your files.', 'wpmudev-plugin-test')}
								</p>
								<button
									className="sui-button sui-button-blue sui-button-lg"
									onClick={handleAuth}
									disabled={isAuthenticating || isLoading}
								>
									{isAuthenticating ? (
										<>
											<span className="sui-icon-loader sui-loading" aria-hidden="true"></span>
											{__('Authenticating...', 'wpmudev-plugin-test')}
										</>
									) : (
										<>
											<span className="sui-icon-cloud" aria-hidden="true"></span>
											{__('Authenticate with Google', 'wpmudev-plugin-test')}
										</>
									)}
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default AuthSection;
