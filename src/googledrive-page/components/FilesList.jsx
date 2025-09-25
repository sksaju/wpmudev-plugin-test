import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import FileItem from './FileItem';
import '../scss/components/FilesList.scss';

const FilesList = ({ files, isLoading, onDownload, onRefresh }) => {
	const [isRefreshing, setIsRefreshing] = useState(false);

	const handleRefresh = async () => {
		setIsRefreshing(true);
		try {
			await onRefresh();
		} catch (err) {
			console.error('Refresh error:', err);
		} finally {
			setIsRefreshing(false);
		}
	};

	if (isLoading) {
		return (
			<div className="files-list">
				<div className="sui-box">
					<div className="sui-box-header">
						<h3 className="sui-box-title">
							<span className="sui-icon-cloud" aria-hidden="true"></span>
							{__('Your Drive Files', 'wpmudev-plugin-test')}
						</h3>
					</div>
					<div className="sui-box-body">
						<div className="files-list__loading">
							<div className="files-list__spinner">
								<span className="sui-icon-loader sui-loading" aria-hidden="true"></span>
							</div>
							<p>{__('Loading files...', 'wpmudev-plugin-test')}</p>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="files-list">
			<div className="sui-box">
				<div className="sui-box-header">
					<h3 className="sui-box-title">
						<span className="sui-icon-cloud" aria-hidden="true"></span>
						{__('Your Drive Files', 'wpmudev-plugin-test')}
					</h3>
					<div className="sui-box-actions">
						<button
							className="sui-button sui-button-ghost"
							onClick={handleRefresh}
							disabled={isRefreshing}
							title={__('Refresh file list', 'wpmudev-plugin-test')}
						>
							<span className={`sui-icon-refresh ${isRefreshing ? 'sui-loading' : ''}`} aria-hidden="true"></span>
							{__('Refresh', 'wpmudev-plugin-test')}
						</button>
					</div>
				</div>
				<div className="sui-box-body">
					{files.length === 0 ? (
						<div className="files-list__empty">
							<div className="files-list__empty-icon">
								<span className="sui-icon-cloud" aria-hidden="true"></span>
							</div>
							<div className="files-list__empty-content">
								<h4>{__('No files found', 'wpmudev-plugin-test')}</h4>
								<p>{__('Your Google Drive appears to be empty. Upload some files or create folders to get started.', 'wpmudev-plugin-test')}</p>
							</div>
						</div>
					) : (
						<div className="files-list__content">
							<div className="files-list__header">
								<p className="files-list__count">
									{files.length} {files.length === 1 ? __('file', 'wpmudev-plugin-test') : __('files', 'wpmudev-plugin-test')}
								</p>
							</div>
							<div className="files-list__items">
								{files.map((file) => (
									<FileItem 
										key={file.id} 
										file={file} 
										onDownload={onDownload} 
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default FilesList;
