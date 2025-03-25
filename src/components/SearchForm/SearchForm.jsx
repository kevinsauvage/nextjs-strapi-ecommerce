'use client';

import { useActionState } from 'react';

import { searchAction } from '@/actions/SearchAction';
import Container from '@/components/Container/Container';

import SubmitButton from '../_forms/SubmitButton/SubmitButton';

import styles from './SearchForm.module.scss';

const SearchForm = ({ size, searchQuery }) => {
  const [, action] = useActionState(searchAction, {
    searchQuery: '',
  });

  return (
    <div className={styles.search}>
      <Container size={size}>
        <form className={styles.form} action={action}>
          <label>
            <input
              className={styles.input}
              type="text"
              name="searchQuery"
              defaultValue={searchQuery}
              placeholder="Search"
              aria-label="Search"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </label>
          <SubmitButton submitText="Search" pendingText="Searching..." />
        </form>
      </Container>
    </div>
  );
};

export default SearchForm;
