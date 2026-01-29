import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { MdDownload, MdUpload } from "react-icons/md";
import { RiExpandUpDownFill, RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import PartItem from '../../components/partItem';

function PartsPageDesktop() {
    function getContrastYIQ(hexcolor) {
        if (!hexcolor) return 'black';
        hexcolor = hexcolor.replace("#", "");
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'black' : 'white';
    }

    const [query, setQuery] = useState("");
    const [listResults, setListResults] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleTag = (tagName) => {
        setSelectedTags(prev =>
            prev.includes(tagName)
                ? prev.filter(t => t !== tagName)
                : [...prev, tagName]
        );
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        fetch("/taglist.json")
            .then(res => res.json())
            .then(data => setTags(data))
            .catch(err => console.error(err));
    }, []);

    const allTags = React.useMemo(() => {
        return Array.from(new Set(listResults.flatMap(part => part.tags || [])));
    }, [listResults]);

    useEffect(() => {
        const fetchParts = async () => {
            try {
                const response = await fetch("/partslist.json");
                const data = await response.json();
                setListResults(data);
            } catch (err) {
                console.error("Error loading JSON:", err);
            }
        };
        fetchParts();
    }, []);

    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return <RiExpandUpDownFill />;
        return sortConfig.direction === 'asc' ? <RiArrowUpSFill /> : <RiArrowDownSFill />;
    };

    const reloadPartsList = (sortKey) => {
        let direction = 'asc';
        if (sortConfig.key === sortKey && sortConfig.direction === 'asc') direction = 'desc';

        const sorted = [...listResults].sort((a, b) => {
            let aVal = a[sortKey] ?? "";
            let bVal = b[sortKey] ?? "";

            if (typeof aVal === "string") aVal = aVal.toLowerCase();
            if (typeof bVal === "string") bVal = bVal.toLowerCase();

            if (aVal < bVal) return direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return direction === 'asc' ? 1 : -1;
            return 0;
        });

        setListResults(sorted);
        setSortConfig({ key: sortKey, direction });
    };

    const filteredResults = listResults.filter(item => {
        // 1. TAG PRIORITY (The Gatekeeper)
        // If user has selected tags, the item MUST match at least one selected tag.
        // If no tags are selected, we let everything through to the search filter.
        const matchesTags = selectedTags.length === 0 || 
            (item.tags && item.tags.some(tag => selectedTags.includes(tag)));

        if (!matchesTags) return false;

        // 2. SEARCH MATCH
        // Only items that passed the tag filter get checked for the search query.
        const lowerQuery = query.toLowerCase();
        const matchesQuery = (
            item.name.toLowerCase().includes(lowerQuery) ||
            (item.manufacturerId && item.manufacturerId.toLowerCase().includes(lowerQuery))
        );

        return matchesQuery;
    });

    return (
        <>
            <div className='d-homepagecontainer'>
                <div className='d-titlecontainer'>
                    <p>Parts</p>
                    <div className='d-inputwrapper'>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className='d-searchbar'
                            placeholder='Search...'
                        />
                    </div>
                </div>
                <div className="d-partslistcontainer">
                    <div className="d-titlecontainer-small">
                        <button>+ Add Item</button>
                        <div className='d-titlecontainer-small-downloadwrapper'>
                            <button><MdDownload /><span style={{ marginLeft: 4 }}>CSV</span></button>
                            <button><MdDownload /><span style={{ marginLeft: 4 }}>JSON</span></button>
                            <button><MdUpload /><span style={{ marginLeft: 4 }}>Import</span></button>
                        </div>
                    </div>
                    <div className="d-partslistwrapper" id="partslistwrapper">
                        <div className="d-partslistheader">
                            <div style={{ width: '15%' }}><span style={{ cursor: 'pointer' }} onClick={() => reloadPartsList('manufacturerId')}>Id {getSortIcon('manufacturerId')}</span></div>
                            <div style={{ width: '50%' }}><span style={{ cursor: 'pointer' }} onClick={() => reloadPartsList('name')}>Name {getSortIcon('name')}</span></div>
                            <div style={{ width: '15%' }}><span style={{ cursor: 'pointer' }} onClick={() => reloadPartsList('quantity')}>Quantity {getSortIcon('quantity')}</span></div>
                            <div style={{ width: '15%' }}><span style={{ cursor: 'pointer' }} onClick={() => reloadPartsList('needed')}>Needed {getSortIcon('needed')}</span></div>
                            <div style={{ width: '10%', display: 'flex', justifyContent: 'center' }}>
                                <div className="custom-tag-dropdown" ref={dropdownRef}>
                                    <button 
                                        type="button"
                                        className="d-dropdown-btn"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <span>
                                            {selectedTags.length > 0 
                                                ? `${selectedTags.length} Selected` 
                                                : "Tags"}
                                        </span>
                                        {isDropdownOpen ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="d-dropdown-menu">
                                            {tags.map(tag => (
                                                <label 
                                                    key={tag.name} 
                                                    className="d-tag-label"
                                                    style={{ 
                                                        backgroundColor: tag.color, 
                                                        color: getContrastYIQ(tag.color) 
                                                    }}
                                                >
                                                    <input 
                                                        type="checkbox" 
                                                        className="d-tag-checkbox"
                                                        checked={selectedTags.includes(tag.name)}
                                                        onChange={() => toggleTag(tag.name)}
                                                    />
                                                    {tag.name}
                                                </label>
                                            ))}

                                            <div className="d-add-button d-tag-label" onClick={() => console.log("Add Tag Logic Here")}>
                                                <span style={{ marginRight: '12px', fontSize: '1rem', lineHeight: 0 }}>+</span>Add Tag
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {filteredResults.map((item) => (
                            <PartItem key={item.id} part={item} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PartsPageDesktop;