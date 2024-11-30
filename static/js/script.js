document.addEventListener("DOMContentLoaded", () => {
    const socket = io.connect('http://' + document.domain + ':' + location.port);
    let currentStatus = 'red';  // 初始状态为红灯

    socket.on('light_status_update', data => {
        console.log('Received light status update:', data);  // 调试用
        const crossroad = document.getElementById(data.id);
        crossroad.querySelector('#red-light').style.backgroundColor = data.status.red ? 'red' : 'gray';
        crossroad.querySelector('#yellow-light').style.backgroundColor = data.status.yellow ? 'yellow' : 'gray';
        crossroad.querySelector('#green-light').style.backgroundColor = data.status.green ? 'green' : 'gray';
        document.getElementById('current-status').innerText = '当前状态: ' + (data.status.red ? '红灯' : data.status.yellow ? '黄灯' : '绿灯');

        // 更新历史数据展示
        const historyList = document.getElementById('history-list');
        const newHistoryItem = document.createElement('li');
        newHistoryItem.innerText = `路口: ${data.id}, 状态: ${document.getElementById('current-status').innerText}, 时间: ${new Date().toLocaleString()}`;
        historyList.appendChild(newHistoryItem);
    });

    window.changeLight = () => {
        // 切换状态逻辑：红 -> 黄 -> 绿 -> 红
        if (currentStatus === 'red') {
            currentStatus = 'yellow';
        } else if (currentStatus === 'yellow') {
            currentStatus = 'green';
        } else {
            currentStatus = 'red';
        }

        const data = { id: 'crossroad-1', status: { red: currentStatus === 'red', yellow: currentStatus === 'yellow', green: currentStatus === 'green' } };
        console.log('Sending change_light event:', data);  // 调试用
        socket.emit('change_light', data);
    }

    let trafficData = 0;
    const trafficDisplay = document.getElementById('traffic-display');
    const trafficInterval = setInterval(() => {
        trafficData = Math.floor(Math.random() * 100); // 随机生成车流量数据
        trafficDisplay.innerText = `当前车流量: ${trafficData}`;
    }, 1000);

});
