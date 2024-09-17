import React from 'react';
import './TabList.css';

function TabList({ tabs, activeTab, onTabClick }) {
    return (
        <div className='tablist'>
            <ul>
                {tabs.map((tab, index) => (
                    <li
                        key={index}
                        className={activeTab === tab.name ? 'active' : ''}
                        onClick={() => onTabClick(tab.name)}>
                        {tab.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default TabList;
