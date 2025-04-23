import React, { FC, useState } from 'react';
import { KeyValueProps, HTTPMethod } from '../../../../../types'; // Import KeyValueProps and HTTPMethod

// Structure for the parsed data
interface ParsedCurlData {
    url: string;
    method: string;
    queryParams: KeyValueProps[];
    headers: KeyValueProps[];
}

// Props for the component
interface ImportCurlProps {
    onImportCurl: (data: ParsedCurlData) => void;
}

const ImportCurl: FC<ImportCurlProps> = ({ onImportCurl }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [curlCommand, setCurlCommand] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); 

    const parseCurlCommand = (command: string): ParsedCurlData | null => {
        try {
            let url = '';
            let method = 'GET'; // Default method
            const headers: KeyValueProps[] = [];
            const queryParams: KeyValueProps[] = [];

            command = command.trim().replace(/\\\n/g, ' '); 

            // --- Enhanced URL Extraction Logic ---
            let urlStartIndex = -1;
            let potentialUrl = '';

            // Priority 1: Look for --url or -L followed by a quoted URL
            let urlMatch = command.match(/(?:--url|-L)\s+(['"])(https?:\/\/[^'"]+)\1/);
            if (urlMatch && urlMatch[2]) {
                potentialUrl = urlMatch[2];
            } else {
                // Priority 2: Look for --url or -L followed by an unquoted URL
                const urlFlagMatch = command.match(/(?:--url|-L)\s+(https?:\/\/.*)/);
                if (urlFlagMatch && urlFlagMatch[1]) {
                    const potentialUrlAndArgs = urlFlagMatch[1];
                    // Find the index of the next potential flag indicator (space followed by - or -- and a letter/digit)
                    // Allow flags like -v, -i, -s, -S, -L, -k, -u user:pass, etc.
                    const nextFlagIndex = potentialUrlAndArgs.search(/\s+-{1,2}[a-zA-Z0-9]/);
                    if (nextFlagIndex !== -1) {
                        potentialUrl = potentialUrlAndArgs.substring(0, nextFlagIndex).trim();
                    } else {
                        potentialUrl = potentialUrlAndArgs.trim(); // Assume rest is URL if no flags follow
                    }
                } else {
                    // Priority 3: Look for the first quoted URL anywhere 
                    urlMatch = command.match(/\s(['"])(https?:\/\/[^'"]+)\1/);
                    if (urlMatch && urlMatch[2]) {
                        potentialUrl = urlMatch[2];
                    } else {
                        // Priority 4: Look for the first unquoted URL anywhere 
                        const firstUrlMatch = command.match(/\s(https?:\/\/.*)/);
                         if (firstUrlMatch && firstUrlMatch[1]) {
                             const potentialUrlAndArgs = firstUrlMatch[1];
                             const nextFlagIndex = potentialUrlAndArgs.search(/\s+-{1,2}[a-zA-Z0-9]/);
                             if (nextFlagIndex !== -1) {
                                 potentialUrl = potentialUrlAndArgs.substring(0, nextFlagIndex).trim();
                             } else {
                                 potentialUrl = potentialUrlAndArgs.trim();
                             }
                        }
                    }
                }
            }

            if (!potentialUrl) {
                throw new Error("Could not parse URL from command.");
            }

            // Extract query params from the determined URL
            const urlParts = potentialUrl.split('?');
            url = urlParts[0]; // The base URL
            if (urlParts.length > 1 && urlParts[1]) {
                const params = new URLSearchParams(urlParts[1]);
                params.forEach((value, key) => {
                    queryParams.push({ name: key, value });
                });
            }

            // To extract Method
            const methodMatch = command.match(/(?:--request|-X)\s+(\w+)/);
            let extractedMethod = method; 
            if (methodMatch && methodMatch[1]) {
                extractedMethod = methodMatch[1].toUpperCase();
            } else {
                // Check for invalid syntax like --requestGET before inferring POST
                // If syntax is ok, try inferring POST from data flags
                // Otherwise, it remains the default 'GET'

                const invalidSyntaxMatch = command.match(/(?:--request|-X)(?!\s)/); 
                if (invalidSyntaxMatch) {
                    throw new Error(`Invalid syntax: Missing space after ${invalidSyntaxMatch[0]} flag.`);
                }
                
                if (command.includes('--data') || command.includes('--data-raw') || command.includes('--data-binary') || command.includes('--data-urlencode')) {
                    extractedMethod = 'POST';
                }
                
            }

            // **Validate extracted method**
            const validMethods = Object.values(HTTPMethod);
            if (!validMethods.includes(extractedMethod as HTTPMethod)) {
                throw new Error(`Invalid HTTP method specified: ${extractedMethod}`);
            }
            method = extractedMethod;

            // Extract Headers using a more robust regex for -H and --header
            const headerRegex = /(?:--header|-H)\s+(['"]?)([^:]+):\s*([^'"]+)\1/g;
            let match;
            while ((match = headerRegex.exec(command)) !== null) {
                 // Ensure we capture the full value even if it contains quotes internally (less common for headers)
                 const key = match[2].trim();
                 const value = match[3].trim();
                 headers.push({ name: key, value });
            }

             // Simple query param extraction 
             if (queryParams.length === 0 && command.includes('-G') && command.includes('--data-urlencode')) {
                 const dataUrlencodeMatch = command.match(/--data-urlencode\s+(['"]?)(.*?)\1/);
                 if (dataUrlencodeMatch && dataUrlencodeMatch[2]) {
                      const params = new URLSearchParams(dataUrlencodeMatch[2]);
                      params.forEach((value, key) => {
                          queryParams.push({ name: key, value });
                      });
                 }
             }

            return { url, method, queryParams, headers };
        } catch (error: any) {
            console.error("Failed to parse CURL command:", error);
            setErrorMessage(error.message || "Failed to parse CURL command.");
            return null;
        }
    };


    const handleImportClick = () => {
        setErrorMessage(''); 
        const parsedData = parseCurlCommand(curlCommand);
        if (parsedData) {
            console.log('Parsed CURL Data:', parsedData);
            onImportCurl(parsedData); // Send data to parent
            // Reset state and close modal
            setCurlCommand('');
            setIsModalOpen(false);
        }
    };

    const handleCancelClick = () => {
        // Reset state and close modal
        setCurlCommand('');
        setErrorMessage('');
        setIsModalOpen(false);
    };


    // Basic modal styling (inline for simplicity)
    const modalStyle: React.CSSProperties = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        border: '1px solid #ccc',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        zIndex: 1000, 
        display: isModalOpen ? 'block' : 'none', 
        minWidth: '400px', 
        maxWidth: '600px',
    };

    const backdropStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', 
        zIndex: 999, 
        display: isModalOpen ? 'block' : 'none', 
    };

    const errorStyle: React.CSSProperties = {
        color: 'red',
        marginTop: '10px',
        fontSize: '0.9em',
        whiteSpace: 'pre-wrap' 
    };

    return (
        <div>
             <button
                className="template__curl-import-button"
                onClick={() => setIsModalOpen(true)}
                style={{ 
                    padding: '4px 8px', 
                    border: '1px solid #4a90e2', 
                    borderRadius: '4px', 
                    cursor: 'pointer',
                    backgroundColor: '#4a90e2', 
                    color: 'white',
                    fontSize : '12px' 
                 }} 
            >
                Import Curl
            </button>

            <div style={backdropStyle} onClick={handleCancelClick}></div>

            <div style={modalStyle}>
                <h3 style={{ marginTop: 0, marginBottom: '15px', textAlign: 'left' }}>Import CURL Command</h3>
                 {errorMessage && <p style={errorStyle}>Error: {errorMessage}</p>}
                <textarea
                    value={curlCommand}
                    onChange={(e) => setCurlCommand(e.target.value)}
                    placeholder="Enter your CURL command"
                    rows={10}
                    style={{ width: '100%', marginBottom: '15px', border: '1px solid #ccc', padding: '8px', boxSizing: 'border-box', fontFamily: 'monospace' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button onClick={handleImportClick} className="btn btn--primary">Import</button>
                    <button onClick={handleCancelClick} className="btn btn--selected">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ImportCurl;