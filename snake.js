const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Node {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = 0;
        this.vy = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();
    }
}

class Snake {
    constructor(length) {
        this.nodes = [];
        this.length = length;
        for (let i = 0; i < length; i++) {
            this.nodes.push(new Node(canvas.width / 2, canvas.height / 2, i === 0 ? 10 : 5));
        }
        this.target = null;
        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }

    handleMouseMove(e) {
        this.target = { x: e.clientX, y: e.clientY };
    }

    update() {
        if (this.target) {
            const head = this.nodes[0];
            const dx = this.target.x - head.x;
            const dy = this.target.y - head.y;
            const angle = Math.atan2(dy, dx);
            const speed = 2;
            head.vx = Math.cos(angle) * speed;
            head.vy = Math.sin(angle) * speed;
        }

        for (let i = this.nodes.length - 1; i > 0; i--) {
            const node = this.nodes[i];
            const nextNode = this.nodes[i - 1];
            const dx = nextNode.x - node.x;
            const dy = nextNode.y - node.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx);
            const targetX = nextNode.x - Math.cos(angle) * node.radius * 2;
            const targetY = nextNode.y - Math.sin(angle) * node.radius * 2;
            node.vx = (targetX - node.x) * 0.1;
            node.vy = (targetY - node.y) * 0.1;
            node.x += node.vx;
            node.y += node.vy;
        }

        this.nodes[0].x += this.nodes[0].vx;
        this.nodes[0].y += this.nodes[0].vy;
    }

    draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 1; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const prevNode = this.nodes[i - 1];
            ctx.beginPath();
            ctx.moveTo(prevNode.x, prevNode.y);
            ctx.lineTo(node.x, node.y);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.closePath();
        }
        this.nodes.forEach(node => node.draw());
    }
}

const snake = new Snake(20);

function animate() {
    snake.update();
    snake.draw();
    requestAnimationFrame(animate);
}

animate();
