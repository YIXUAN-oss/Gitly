import React, { useEffect, useRef } from 'react';

/**
 * 提交历史图谱组件
 */
export const CommitGraph: React.FC<{ data: any }> = ({ data }) => {
    const canvasRef = useRef<any>(null);

    useEffect(() => {
        if (!canvasRef.current || !data?.log) {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return;
        }

        // 设置画布大小
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        // 绘制提交图谱
        drawCommitGraph(ctx, data.log.all, canvas.width, canvas.height);
    }, [data]);

    const drawCommitGraph = (
        ctx: any,
        commits: any[],
        width: number,
        height: number
    ) => {
        ctx.clearRect(0, 0, width, height);

        const commitHeight = 60;
        const commitRadius = 8;
        const leftMargin = 50;
        const topMargin = 30;

        commits.forEach((commit, index) => {
            const y = topMargin + index * commitHeight;
            const x = leftMargin;

            // 绘制连接线
            if (index > 0) {
                ctx.strokeStyle = '#569cd6';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(x, y - commitHeight + commitRadius);
                ctx.lineTo(x, y - commitRadius);
                ctx.stroke();
            }

            // 绘制提交节点
            ctx.fillStyle = '#569cd6';
            ctx.beginPath();
            ctx.arc(x, y, commitRadius, 0, 2 * Math.PI);
            ctx.fill();

            // 绘制提交信息
            ctx.fillStyle = '#cccccc';
            ctx.font = '12px monospace';
            ctx.fillText(commit.hash.substring(0, 8), x + 20, y - 10);

            ctx.fillStyle = '#ffffff';
            ctx.font = '14px sans-serif';
            const message = commit.message.split('\n')[0];
            const truncated = message.length > 50 ? message.substring(0, 50) + '...' : message;
            ctx.fillText(truncated, x + 20, y + 10);

            ctx.fillStyle = '#888888';
            ctx.font = '11px sans-serif';
            ctx.fillText(`${commit.author_name} · ${new Date(commit.date).toLocaleDateString('zh-CN')}`, x + 20, y + 25);
        });
    };

    return (
        <div className="commit-graph">
            <div className="section-header">
                <h2>提交历史图谱</h2>
                <p className="section-description">
                    可视化显示提交历史和分支关系
                </p>
            </div>
            <div className="graph-container">
                <canvas ref={canvasRef} style={{ width: '100%', height: '600px' }} />
            </div>
            {!data?.log && (
                <div className="empty-state">
                    <p>📊 正在加载提交历史...</p>
                </div>
            )}
        </div>
    );
};

