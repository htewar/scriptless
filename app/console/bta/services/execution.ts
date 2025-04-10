import { Edge, Node } from "reactflow";
import { AssertionCondition, AssertionType, CustomNodeData, KeyValueProps, KVListProps } from "../types";
import { AxiosResponse } from "axios";

export const filterEdges = (nodes: Node<CustomNodeData>[], edges: Edge[]): Edge[] => {
    const nodeMap = new Map<string, string>();
    nodes.forEach(node => nodeMap.set(node.id, node.data.identifier));
    return edges.filter(({ source, target }) => (nodeMap.get(source) === "1" && nodeMap.get(target) === "1"))
}

export const isStartNode = (connections: Edge[], id: string | null): boolean => {
    if (id) {
        const isTarget = connections.some(connection => connection.target === id);
        const isSource = connections.some(connection => connection.source === id)
        if (!isSource && !isTarget) return true
        if (isTarget) return false;
        return isSource;
    }
    return false;
}

export const buildExecutionTree = (edges: Edge[], position: string): string[] => {
    const graph = new Map<string, string>();
    edges.forEach(({ source, target }) => graph.set(source, target));
    const executionOrder: string[] = [];
    let current = position;
    while (graph.has(current)) {
        executionOrder.push(current);
        current = graph.get(current)!;
    }
    executionOrder.push(current);
    return executionOrder;
};

export const trimExecutionTree = (tree: string[], id: string): string[] => {
    const index = tree.indexOf(id);
    return index !== -1 ? tree.slice(index) : [];
}

export const getPreAssertionNodes = (connections: Edge[], id: string, preEdge: { source: string, target: string } | null): string[] => {
    if (preEdge) connections = [...connections, preEdge as Edge]
    const connectedNodes: Set<string> = new Set();
    const queue: string[] = [];
    queue.push(id);
    while (queue.length > 0) {
        const currentNode = queue.shift();
        if (!currentNode) continue;

        connections.forEach(({ source, target }) => {
            if (target === currentNode && !connectedNodes.has(source)) {
                connectedNodes.add(source);
                queue.push(source);
            }
        });
    }
    return Array.from(connectedNodes).reverse();
}

export const getNodeFromID = (nodes: Node<CustomNodeData>[], id: string): Node<CustomNodeData> | undefined => nodes.find(n => n.id == id);

export const getResponseKeyValue = (response: AxiosResponse, location: string, type?: AssertionType): [boolean, any] => {
    const keys = location.split(".");
    let value: any;
    if (type == "Response Assertion")
        value = response.data;
    else if (type == "Headers Assertion")
        value = response.headers;
    else value = response;
    for (const key of keys) {
        if (value && typeof value === "object" && key in value)
            value = value[key];
        else return [false, undefined];
    }
    return [true, value];
}

export const getQueryKeyValue = (query: KeyValueProps[], key: string): [boolean, any] => {
    const kvMap = new Map<string, string>();
    query.forEach(({ name, value }) => kvMap.set(name, value));
    return kvMap.has(key) ? [true, kvMap.get(key)] : [false, ""];
}

export const getBodyKeyValue = (body: string, key: string): [boolean, any] => {
    try {
        const parsedJSON = JSON.parse(body)
        return key in parsedJSON ? [true, parsedJSON[key]] : [false, ""]
    } catch (e) {
        return [false, ""]
    }
}

export const URLHasPath = (url: string, path: string): boolean => {
    const exp = new RegExp(`\\{${path}\\}`, "g");
    return exp.test(url);
}

export const assertionComparison = (condition: AssertionCondition, value: any, comparisonValue?: any): boolean => {
    switch (condition) {
        case "Equal To":
            return value == comparisonValue;
        case "Greater Than":
            return value > comparisonValue;
        case "Greater Than OR Equal To":
            return value >= comparisonValue;
        case "Less Than":
            return value < comparisonValue;
        case "Less Than OR Equal To":
            return value <= comparisonValue;
        case "Not Empty":
            return value !== null && value !== undefined && value !== "" && (!Array.isArray(value) || value.length > 0);
        case "Not Nil":
            return value !== null && value !== undefined;
    }
    return false;
}

export const executeUserScript = (userCode: string, key: string, value: any): any => {
    // Ensure the key is a valid JS variable name
    const varDeclarationRegex = new RegExp(`let\\s+${key}\\s*=\\s*""`, "m");

    if (!varDeclarationRegex.test(userCode)) {
        throw new Error(`Variable "${key}" not found in the provided script.`);
    }

    // Replace `let key = ""` with `let key = value`
    const modifiedCode = userCode.replace(varDeclarationRegex, `let ${key} = ${JSON.stringify(value)}`);

    try {
        // Use `new Function()` to safely execute the modified script
        return new Function(`${modifiedCode}\n return ${key};`)();
    } catch (error) {
        console.error("Error executing user script:", error);
        return null;
    }
}

export const downloadJSON = (data: object, filename = "data.json") => {
    const jsonString = JSON.stringify(data, null, 2); // Convert object to JSON string (formatted)
    const blob = new Blob([jsonString], { type: "application/json" }); // Create a Blob
    const url = URL.createObjectURL(blob); // Create a downloadable URL

    const a = document.createElement("a"); // Create an anchor element
    a.href = url;
    a.download = filename; // Set the filename
    document.body.appendChild(a);
    a.click(); // Trigger download
    document.body.removeChild(a); // Clean up

    URL.revokeObjectURL(url); // Free memory
};

export const getFormData = (body: KeyValueProps[] = []): URLSearchParams => {
    const formData = new URLSearchParams();
    body.forEach((kv) => {
        if (kv.name) formData.append(kv.name, kv.value ?? "");
    });
    return formData;
};
