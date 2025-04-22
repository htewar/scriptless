import React, { FC, useState, useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
    ReactFlowProvider,
    Controls,
    Background,
    BackgroundVariant,
    Node,
    Edge,
    useNodesState,
    useEdgesState,
    NodeMouseHandler,
    MarkerType,
    XYPosition
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomNode, CustomEdge } from '../../../components'; // Adjust path as needed

// Define a type for the expected node data structure from the JSON
interface InputNodeData {
    id?: string; // id might be missing in raw data
    type?: string;
    name?: string;
    url?: string;
    method?: string;
    headers?: any[];
    queryParams?: any[];
    payload?: any;
    payloadType?: string;
    metadata?: {
        position?: XYPosition;
    };
    [key: string]: any; // Allow other properties
}

// Type alias for clarity: A React Flow Node whose data property is InputNodeData
type PreviewFlowNode = Node<InputNodeData>;

interface FlowPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    nodes: InputNodeData[]; // Expect nodes conforming to InputNodeData
    edges: Edge[];
}

const FlowPreviewModal: FC<FlowPreviewModalProps> = ({ isOpen, onClose, nodes: initialNodes, edges: initialEdges }) => {
    // State for React Flow nodes. The hook manages the Node wrapper.
    const [previewNodes, setPreviewNodes, onNodesChange] = useNodesState<InputNodeData>([]);
    const [previewEdges, setPreviewEdges, onEdgesChange] = useEdgesState(initialEdges);
    // State for the selected node, explicitly typed as Node<InputNodeData>
    const [selectedNode, setSelectedNode] = useState<PreviewFlowNode | null>(null);

    // Define a default gap value
    const defaultGap = 100; // Adjust this value as needed

    // Load nodes and edges when the modal opens or data changes
    useEffect(() => {
        if (isOpen) {
            // Ensure edges have the correct marker type and edge type
            const formattedEdges = initialEdges.map(edge => ({
                ...edge,
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    width: 15,
                    height: 15,
                    color: "#a0ceff", // Match draft view color
                },
                type: 'customEdge', // Ensure edge type is set for custom rendering
            }));

            // Map InputNodeData to PreviewFlowNode (Node<InputNodeData>)
            const formattedNodes: PreviewFlowNode[] = initialNodes.map((inputData, index) => {
                const metaPosition = inputData.metadata?.position;
                let position: XYPosition = { x: 0, y: 0 }; // Default position

                if (metaPosition && typeof metaPosition.x === 'number' && typeof metaPosition.y === 'number') {
                    position = { x: metaPosition.x + defaultGap * index, y: metaPosition.y + defaultGap * index };
                } else {
                    console.warn(`Node at index ${index} (ID: ${inputData.id || '(no id)'}) is missing a valid position in metadata. Defaulting to { x: 0, y: 0 }. Original node data:`, inputData);
                }

                console.log("inputData", inputData)

                const flowNode: PreviewFlowNode = {
                    id: inputData.id || `preview-node-${index}`, // Ensure an ID exists
                    position,
                    data: { ...inputData, label: inputData.name, status: 'IDLE', completion: 0 }, // Change 'name' to 'label' and add icon
                    type: 'customNode',
                };
                return flowNode;
            });

            setPreviewNodes(formattedNodes);
            setPreviewEdges(formattedEdges);
            setSelectedNode(null); // Reset selected node when modal opens
        } else {
            // Clear states when modal is closed
            setPreviewNodes([]);
            setPreviewEdges([]);
            setSelectedNode(null);
        }
    }, [isOpen, initialNodes, initialEdges, setPreviewNodes, setPreviewEdges]);

    const nodeTypes = useMemo(() => ({ customNode: CustomNode }), []);
    const edgeTypes = useMemo(() => ({ customEdge: CustomEdge }), []);

    // Type the node parameter in the callback explicitly
    const handleNodeClick: NodeMouseHandler = useCallback((_event, node: PreviewFlowNode) => {
        console.log("Node clicked in preview:", node);
        setSelectedNode(node);
    }, []);

    const handlePaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Flow Preview</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none p-1 rounded-full hover:bg-gray-100"
                        aria-label="Close modal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content Area (Flow + Node Info) */}
                <div className="flex flex-1 overflow-hidden">
                    {/* React Flow Area */}
                    <div className="flex-grow h-full border-r border-gray-200 relative">
                        <ReactFlowProvider>
                            <ReactFlow
                                nodes={previewNodes}
                                edges={previewEdges}
                                onNodesChange={onNodesChange}
                                onEdgesChange={onEdgesChange}
                                onNodeClick={handleNodeClick}
                                onPaneClick={handlePaneClick}
                                nodeTypes={nodeTypes}
                                edgeTypes={edgeTypes}
                                fitView
                                fitViewOptions={{ padding: 0.2 }}
                                minZoom={0.3}
                                maxZoom={2}
                                defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
                                className="bg-gray-50"
                            >
                                <Controls position="bottom-right" />
                                <Background variant={BackgroundVariant.Lines} gap={12} size={1} color="#e2e8f0" />
                            </ReactFlow>
                        </ReactFlowProvider>
                    </div>

                    {/* Node Info Panel */}
                    <div className="w-1/3 h-full p-4 overflow-y-auto bg-white flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">Node Information</h3>
                        {selectedNode ? (
                            <div className="space-y-2 text-sm text-gray-600">
                                <div><strong>ID:</strong> {selectedNode.id}</div>
                                <div><strong>Type:</strong> {selectedNode.type || 'Default'}</div>
                                {selectedNode.data.name && <div><strong>Name:</strong> {selectedNode.data.name}</div>}
                                <div><strong>Position:</strong> {`x: ${selectedNode.position.x.toFixed(1)}, y: ${selectedNode.position.y.toFixed(1)}`}</div>
                                <div className="mt-3 pt-3 border-t">
                                    <h4 className="font-semibold mb-1 text-gray-700">Metadata:</h4>
                                    <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                        {/* Display the entire data object which includes metadata */}
                                        {JSON.stringify(selectedNode.data, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 italic mt-2">
                                Click on a node to view its details.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlowPreviewModal;
