import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import '../scss/components/FileUpload.scss';

const FileUpload = ({ onUpload, onUploadComplete }) => {
	const [file, setFile] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleFileChange = (e) => {
		const selectedFile = e.target.files[0];
		setFile(selectedFile);
		setError('');
		setSuccess('');
	};

	const handleUpload = async () => {
		if (!file) return;

		setIsUploading(true);
		setError('');
		setSuccess('');
		setUploadProgress(0);

		try {
			const formData = new FormData();
			formData.append('file', file);
			formData.append('name', file.name);

			// Simulate progress for better UX
			const progressInterval = setInterval(() => {
				setUploadProgress(prev => Math.min(prev + 10, 90));
			}, 200);

			const response = await apiFetch({
				path: wpmudevDriveTest.restEndpointUpload,
				method: 'POST',
				body: formData,
			});

			clearInterval(progressInterval);
			setUploadProgress(100);
			setSuccess(__('File uploaded successfully!', 'wpmudev-plugin-test'));
			setFile(null);
			document.getElementById('file-input').value = '';
			onUploadComplete();

			setTimeout(() => {
				setSuccess('');
				setUploadProgress(0);
			}, 3000);
		} catch (err) {
			setError(err.message || __('Failed to upload file', 'wpmudev-plugin-test'));
		} finally {
			setIsUploading(false);
		}
	};

	const formatFileSize = (bytes) => {
		if (!bytes) return '';
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
	};

	return (
		<div className="file-upload">
			<div className="sui-box">
				<div className="sui-box-header">
					<h3 className="sui-box-title">
						<span className="sui-icon-upload" aria-hidden="true"></span>
						{__('Upload File to Drive', 'wpmudev-plugin-test')}
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

					<div className="file-upload__dropzone">
						<input
							id="file-input"
							type="file"
							className="file-upload__input"
							onChange={handleFileChange}
							accept="*/*"
						/>
						<label htmlFor="file-input" className="file-upload__label">
							<div className="file-upload__icon">
								<span className="sui-icon-upload" aria-hidden="true"></span>
							</div>
							<div className="file-upload__text">
								<h4>{__('Choose File to Upload', 'wpmudev-plugin-test')}</h4>
								<p>{__('Click to browse or drag and drop files here', 'wpmudev-plugin-test')}</p>
							</div>
						</label>
					</div>

					{file && (
						<div className="file-upload__preview">
							<div className="file-upload__file-info">
								<div className="file-upload__file-icon">
									<span className="sui-icon-document" aria-hidden="true"></span>
								</div>
								<div className="file-upload__file-details">
									<h5>{file.name}</h5>
									<p>{formatFileSize(file.size)}</p>
								</div>
								<button
									type="button"
									className="file-upload__remove"
									onClick={() => {
										setFile(null);
										document.getElementById('file-input').value = '';
									}}
								>
									<span className="sui-icon-close" aria-hidden="true"></span>
								</button>
							</div>
						</div>
					)}

					{isUploading && (
						<div className="file-upload__progress">
							<div className="sui-progress">
								<span className="sui-progress-text">{uploadProgress}%</span>
								<div className="sui-progress-bar">
									<span 
										className="sui-progress-fill" 
										style={{ width: `${uploadProgress}%` }}
									></span>
								</div>
							</div>
						</div>
					)}

					<div className="file-upload__actions">
						<button
							className="sui-button sui-button-blue"
							onClick={handleUpload}
							disabled={!file || isUploading}
						>
							{isUploading ? (
								<>
									<span className="sui-icon-loader sui-loading" aria-hidden="true"></span>
									{__('Uploading...', 'wpmudev-plugin-test')}
								</>
							) : (
								<>
									<span className="sui-icon-upload" aria-hidden="true"></span>
									{__('Upload File', 'wpmudev-plugin-test')}
								</>
							)}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FileUpload;
