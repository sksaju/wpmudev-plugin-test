import { __ } from '@wordpress/i18n';
import '../scss/components/Pagination.scss';

const Pagination = ({ 
	hasNextPage, 
	isLoading, 
	onLoadMore, 
	currentCount, 
	totalCount 
}) => {
	if (!hasNextPage && currentCount <= 20) {
		return null;
	}

	return (
		<div className="pagination">
			<div className="pagination__info">
				{totalCount ? (
					<p className="pagination__count">
						{__('Showing', 'wpmudev-plugin-test')} {currentCount} {__('of', 'wpmudev-plugin-test')} {totalCount} {__('files', 'wpmudev-plugin-test')}
					</p>
				) : (
					<p className="pagination__count">
						{__('Showing', 'wpmudev-plugin-test')} {currentCount} {__('files', 'wpmudev-plugin-test')}
					</p>
				)}
			</div>

			{hasNextPage && (
				<div className="pagination__actions">
					<button
						className="sui-button sui-button-ghost"
						onClick={onLoadMore}
						disabled={isLoading}
					>
						{isLoading ? (
							<>
								<span className="sui-icon-loader sui-loading" aria-hidden="true"></span>
								{__('Loading...', 'wpmudev-plugin-test')}
							</>
						) : (
							<>
								<span className="sui-icon-plus" aria-hidden="true"></span>
								{__('Load More', 'wpmudev-plugin-test')}
							</>
						)}
					</button>
				</div>
			)}
		</div>
	);
};

export default Pagination;
