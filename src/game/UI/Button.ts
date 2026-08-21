function createButton(scene: Phaser.Scene, x: number, y: number, color: number, label: string, font: string, onClick: any) {
    const width = 220;
    const height = 60;
    const radius = 16;

    const bg = scene.add.graphics();
    bg.fillStyle(color, 1);
    bg.fillRoundedRect(-width / 2, -height / 2, width, height, radius);
    bg.lineStyle(4, 0xffffff, 1);
    bg.strokeRoundedRect(-width / 2, -height / 2, width, height, radius);

    const text = scene.add.text(0, 0, label, {
        color: '#ffffff',
        align: 'center',
        fontFamily: font,
        fontSize: '24px',
    }).setOrigin(0.5);

    const container = scene.add.container(x, y, [bg, text]);
    container.setSize(width, height);
    container.setInteractive()
        .on('pointerdown', onClick)
        .on('pointerover', () => {
            container.setScale(1.1);
            bg.clear()
            .fillStyle(color, 0.9)
            .fillRoundedRect(-width / 2, -height / 2, width, height, radius)
            .lineStyle(4, 0xffffff, 0.7)
            .strokeRoundedRect(-width / 2, -height / 2, width, height, radius)})
        .on('pointerout', () => {
            container.setScale(1);
            bg.clear()
            .fillStyle(color, 1)
            .fillRoundedRect(-width / 2, -height / 2, width, height, radius)
            .lineStyle(4, 0xffffff, 1)
            .strokeRoundedRect(-width / 2, -height / 2, width, height, radius)});

    return container;
}

export {createButton};