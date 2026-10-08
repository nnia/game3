 const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const scoreElement = document.getElementById("score");

    const gridSize = 20;
    const tileCountX = canvas.width / gridSize - 1;
    const tileCountY = canvas.height / gridSize - 1;

    let snake = [{ x: 3, y: 3 }];
    let food = { x: 5, y: 5 };
    let dx = 1;
    let dy = 0;
    let score = 0;
    let gameInterval;
    const speed = 1000; // Скорость игры (мс на один шаг)

    function main() {
        if (hasGameEnded()) {
            ctx.fillStyle = "rgba(11, 15, 25, 0.8)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            ctx.font = "bold 30px sans-serif";
            ctx.fillStyle = "#ff416c";
            ctx.textAlign = "center";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#ff416c";
            ctx.fillText("Игра Окончена", canvas.width / 2, canvas.height / 2);
            
            ctx.font = "16px sans-serif";
            ctx.fillStyle = "#a0aec0";
            ctx.shadowBlur = 0;
            ctx.fillText("Нажмите для перезапуска", canvas.width / 2, canvas.height / 2 + 40);
            return;
        }

        clearCanvas();
        ctx.fillText("ctx " + ctx.width + " " + ctx.height, ctx.width / 2, ctx.height / 2 - 20);
        ctx.fillText("canvas " + canvas.width + " " + canvas.height, canvas.width / 2, canvas.height / 2 - 10);
        drawFood();
        moveSnake();
        drawSnake();

    
        gameInterval = setTimeout(main, speed);
    }

    function clearCanvas() {
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Рисуем легкую футуристичную сетку
        ctx.strokeStyle = "rgba(31, 41, 55, 0.4)";
        ctx.lineWidth = 2;
        for (let i = 0; i < tileCountX; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
        }
       for (let i = 0; i < tileCountY; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
    }

    function drawSnake() {
        snake.forEach((part, index) => {
            const isHead = index === 0;
            
            // Настройка неонового свечения
            ctx.shadowBlur = isHead ? 15 : 8;
            ctx.shadowColor = isHead ? "#00f2fe" : "#4facfe";

            // Градиент от головы к хвосту
            const gradient = ctx.createLinearGradient(
                part.x * gridSize, part.y * gridSize, 
                (part.x + 1) * gridSize, (part.y + 1) * gridSize
            );
            if (isHead) {
                gradient.addColorStop(0, '#00f2fe');
                gradient.addColorStop(1, '#4facfe');
            } else {
                gradient.addColorStop(0, '#4facfe');
                gradient.addColorStop(1, '#0000ff');
            }
            
            ctx.fillStyle = gradient;
            
            // Скругленные сегменты змейки вместо обычных квадратов
            drawRoundedRect(
                part.x * gridSize + 1, 
                part.y * gridSize + 1, 
                gridSize - 2, 
                gridSize - 2, 
                isHead ? 6 : 4
            );
        });
        // Сброс тени для других элементов
        ctx.shadowBlur = 0; 
    }

    function drawFood() {
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#ff416c";
        
        // Красивая градиентная еда (ягода)
        const gradient = ctx.createRadialGradient(
            food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, 1,
            food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2
        );
        gradient.addColorStop(0, '#ff4b2b');
        gradient.addColorStop(1, '#ff416c');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(food.x * gridSize + gridSize/2, food.y * gridSize + gridSize/2, gridSize/2 - 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        snake.unshift(head);

        const hasEatenFood = snake[0].x === food.x && snake[0].y === food.y;
        if (hasEatenFood) {
            score += 10;
            scoreElement.innerText = score;
            generateFood();
        } else {
            snake.pop();
        }
    }

    function generateFood() {
        food.x = Math.floor(Math.random() * tileCountX);
        food.y = Math.floor(Math.random() * tileCountY);
        
        // Проверяем, чтобы еда не спавнилась внутри змейки
        snake.forEach(part => {
            if (part.x === food.x && part.y === food.y) generateFood();
        });
    }

    function hasGameEnded() {
        // Столкновение со стенами
        if (snake[0].x < 0 || snake[0].x >= tileCountX || snake[0].y < 0 || snake[0].y >= tileCountY) return true;
        
        // Столкновение с собственным телом
        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
        }
        return false;
    }

    function drawRoundedRect(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height - radius);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();
    }

    function resetGame() {
        snake = [{ x: 3, y: 3 }];
        food = { x: 5, y: 5 };
        dx = 1;
        dy = 0;
        score = 0;
        scoreElement.innerText = score;
        clearTimeout(gameInterval);
        main();
    }

    window.addEventListener("mouseup", function (e) {
        x = event.clientX; // Координата X
        y = event.clientY; // Координата Y
        if (Math.abs(x - snake[0].x) > Math.abs(y - snake[0].y)) {
            if (x > snake[0].x) { dx = 1; dy = 0; }
            else { dx = -1; dy = 0; }
        }
        else {
            if (y > snake[0].y) { dx = 0; dy = 1; }
            else { dx = 0; dy = -1; }
        }     
        if (hasGameEnded()) resetGame();
    });
    window.addEventListener("keydown", e => {
        switch (e.key) {
            case "ArrowUp":
                if (dy === 0) { dx = 0; dy = -1; }
                break;
            case "ArrowDown":
                if (dy === 0) { dx = 0; dy = 1; }
                break;
            case "ArrowLeft":
                if (dx === 0) { dx = -1; dy = 0; }
                break;
            case "ArrowRight":
                if (dx === 0) { dx = 1; dy = 0; }
                break;
        }
        if (hasGameEnded()) resetGame();
    });

    main();
