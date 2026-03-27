"use client";

import ReactFlow, { Background, Controls, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import { TurboNode } from './TurboNode';

const nodeTypes = { turbo: TurboNode };

export default function RoadmapVisualizer({ nodes, edges }: { nodes: any[], edges: any[] }) {
    return (
        <div className="h-full w-full bg-[#030712] relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
            >
                <Background
                    color="#22d3ee"
                    gap={30}
                    variant={BackgroundVariant.Dots}
                    style={{ opacity: 0.15 }}
                />
                {/* Styled the zoom controls to be dark */}
                <Controls showInteractive={false} className="bg-[#0B0F19] border border-white/10 shadow-xl rounded-lg overflow-hidden fill-white" />
            </ReactFlow>
        </div>
    );
}