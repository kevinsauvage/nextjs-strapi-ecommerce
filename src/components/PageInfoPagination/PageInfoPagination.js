import Button from '@/components/Button/Button';
import { getCurrentUrlWithoutParameters } from '@/utils';

import styles from './PageInfoPagination.module.scss';

const PageInfoPagination = async ({ pageInfo, searchParameters }) => {
  const getNextPath = async () => {
    const currentUrl = await getCurrentUrlWithoutParameters();
    const newSearchParameters = new URLSearchParams(searchParameters);
    newSearchParameters.set('after', pageInfo.endCursor);
    newSearchParameters.delete('before');

    return `${currentUrl}?${newSearchParameters.toString()}`;
  };

  const getPreviousPath = async () => {
    const currentUrl = await getCurrentUrlWithoutParameters();
    const newSearchParameters = new URLSearchParams(searchParameters);
    newSearchParameters.set('before', pageInfo.startCursor);
    newSearchParameters.delete('after');

    return `${currentUrl}?${newSearchParameters.toString()}`;
  };

  return (
    <div className={styles.buttons}>
      <Button disabled={!pageInfo.hasPreviousPage} href={await getPreviousPath()}>
        Previous
      </Button>
      <Button disabled={!pageInfo.hasNextPage} href={await getNextPath()}>
        Next
      </Button>
    </div>
  );
};

export default PageInfoPagination;
