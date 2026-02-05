import React from 'react';
import { useSpec } from '../../contexts/SpecContext';
import { EXPERIMENT_SPECS } from '../../specs/experiment';
import { BulbOutlined } from '@ant-design/icons';

const SpecOverlay = ({ specId, children, style = {} }) => {
    const { showSpecs, openSpecDetails, selectedSpecId } = useSpec();
    const specIds = Array.isArray(specId) ? specId : [specId];
    const specs = specIds.map(id => EXPERIMENT_SPECS[id]).filter(Boolean);

    if (!showSpecs || specs.length === 0) {
        return <>{children}</>;
    }

    const getColor = (level) => {
        switch (level) {
            case 'critical': return '#ff4d4f';
            case 'warning': return '#faad14';
            default: return '#1890ff';
        }
    };

    // Use highest severity level for the marker color
    const highestLevel = specs.reduce((acc, s) => {
        if (s.level === 'critical') return 'critical';
        if (s.level === 'warning' && acc !== 'critical') return 'warning';
        return acc;
    }, 'info');

    const color = getColor(highestLevel);

    // Check if this overlay is selected. Logic: if any of its IDs match the selected original ID(s)
    const isSelected = Array.isArray(selectedSpecId)
        ? selectedSpecId.some(id => specIds.includes(id))
        : specIds.includes(selectedSpecId);

    return (
        <div
            className="spec-overlay-container"
            data-spec-id={specId}
            style={{
                position: 'relative',
                display: 'inline-block',
                width: '100%',
                ...style
            }}
        >
            {children}
            <div
                onClick={(e) => {
                    e.stopPropagation();
                    openSpecDetails(specIds);
                }}
                style={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    background: isSelected ? color : '#fff',
                    color: isSelected ? '#fff' : color,
                    border: `1px solid ${color}`,
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    transition: 'all 0.2s cubic-bezier(0.645, 0.045, 0.355, 1)',
                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                }}
                title={`查看方案: ${specs[0]?.title || ''}`}
            >
                <BulbOutlined />
            </div>

            {isSelected && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    border: `2px solid ${color}`,
                    borderRadius: 4,
                    pointerEvents: 'none',
                    zIndex: 999
                }} />
            )}
        </div>
    );
};

export default SpecOverlay;
