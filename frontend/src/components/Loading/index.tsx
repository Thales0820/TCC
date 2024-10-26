// components/Loading.tsx
import React from 'react';
import styles from './style.module.css';

export const Loading = ({ loading }: { loading: boolean }) => {
    if (!loading) return null;
    return (
        <div className={styles.loadingOverlay}>
            <div className={styles.loadingSpinner}></div>
        </div>
    );
}
