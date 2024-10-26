import React from 'react';
import styles from './style.module.css';

interface ToastProps {
    show: boolean;
    message: string;
    colors: string;
    onClose: () => void;
}

export const Toast = ({ show, message, colors, onClose }: ToastProps) => {
    if (!show) return null;
    return (
        <div className={`${styles.toast} ${styles[colors]}`}>
            <button onClick={onClose}>X</button>
            <p>{message}</p>
        </div>
    );
}
