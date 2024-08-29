import React from 'react';

export const LoadingOverlay = () => {
    return (
        <div style={styles.overlay}>
            <div style={styles.spinner}>Loading...</div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    spinner: {
        fontSize: '24px',
        color: '#fff',
    },
};
