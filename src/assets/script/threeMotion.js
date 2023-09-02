import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class threeMotion {
    constructor() {
        this.camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.01, 15 )
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.rayCast = new THREE.Raycaster();
        this.map = [
            [0,0,0,0,1,0,1,0,0,0],
            [0,0,0,0,1,0,1,0,0,0],
            [0,0,0,0,1,0,1,0,0,0],
            [0,0,0,0,1,0,1,1,1,1],
            [0,0,0,0,1,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1],
            [1,0,1,0,0,0,0,0,0,0],
            [1,0,1,0,0,0,0,0,0,0]
        ]
        this.lookMesh;
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.cameraSpeed = 0.05;
        // this.mouse = new THREE.Vector2();
        // this.mouse.x = -1;
        // this.mouse.y = -1;
        // this.ref;
        
        window.addEventListener('resize', this.resize.bind(this));
        document.addEventListener('keydown', this.onKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        // this.renderer.domElement.addEventListener( "click", (e)=>{
        //     this.onClick(e);
        // }, false);
    }
    // onClick(e){
    //     let gapX = e.clientX - e.offsetX;
    //     let gapY = e.clientY - e.offsetY;

    //     this.mouse.x = ((e.clientX - gapX) / ( this.ref.clientWidth )) * 2 - 1;
    //     this.mouse.y =  - ((e.clientY - gapY) / ( this.ref.clientHeight )) * 2 + 1;
    //     this.rayCast.setFromCamera( this.mouse, this.camera );

    //     let intersects = this.rayCast.intersectObjects( this.scene.children );
    //     intersects.forEach( 
    //         obj => {
    //             obj.object.material.color.set(0x00ff00)
    //             console.log(obj)
    //         }
    //     );
    // }
    init(ref){
        console.log('init');
        this.ref=ref;
        
        ref.appendChild( this.renderer.domElement );

        this.draw();
        this.resize();
        this.animation();
    }
    draw(){
        const axesHelper = new THREE.AxesHelper();
        const mazeGroup = new THREE.Group();

        // wall
        let roadWidth = 0.2;
        let roadThickness = 0.3;
        let wallCount = this.map.length*this.map[0].length;
        let wallGeometry = new THREE.BoxGeometry( roadWidth, 0.5, roadThickness );
        wallGeometry.translate(roadWidth/2, 0.25, -roadThickness/2);
        const wallMesh = new THREE.InstancedMesh( 
            wallGeometry, 
            new THREE.MeshBasicMaterial({ 
                color: 0x242424,
                // wireframe: true 
            }),
            wallCount
        );
        this.lookMesh = new THREE.Mesh( 
            new THREE.BoxGeometry( 0.1,0.1,0.1 ),
            new THREE.MeshBasicMaterial({ color: 0xff8080 })
        );

        // let clickMesh = new THREE.Mesh( 
        //     new THREE.BoxGeometry( 0.1,0.1,0.1 ),
        //     new THREE.MeshBasicMaterial({ color: 0x348feb })
        // );
        
        // maze 배치
        this.map.map((a,i)=>{
            let v = ((this.map.length-1)-i) * roadThickness;
            a.map((b,j)=>{
                if(b == 1) {
                    let coordinate = Number(i.toString()+j.toString());
                    wallMesh.setMatrixAt(coordinate, new THREE.Matrix4().makeTranslation((j*roadWidth),0,-v));
                    mazeGroup.add(wallMesh);
                }
            })
        })
        
        this.scene.add(axesHelper);
        this.scene.add(mazeGroup);
        this.scene.add(this.lookMesh);
        // this.scene.add(clickMesh);
        mazeGroup.position.set(0,0,0);
        this.lookMesh.position.set(0.29,0.2,0.5);
        // clickMesh.position.set(0.29,0.2,0.5);

        this.camera.position.copy(this.lookMesh.position);
        this.camera.position.y += 1;
    }
    onKeyDown(event) {
        switch (event.key) {
            case 'w':
                this.moveForward = true;
                break;
            case 's':
                this.moveBackward = true;
                break;
            case 'a':
                this.moveLeft = true;
                break;
            case 'd':
                this.moveRight = true;
                break;
        }
    }
    onKeyUp(event) {
        switch (event.key) {
            case 'w':
                this.moveForward = false;
                break;
            case 's':
                this.moveBackward = false;
                break;
            case 'a':
                this.moveLeft = false;
                break;
            case 'd':
                this.moveRight = false;
                break;
        }
    }
    animation = () => {
        requestAnimationFrame(this.animation);
 
        if (this.moveForward) {
            this.lookMesh.position.z -= this.cameraSpeed;
        }
        if (this.moveBackward) {
            this.lookMesh.position.z += this.cameraSpeed;
        }
        if (this.moveLeft) {
            this.camera.rotation.y += this.cameraSpeed;
            this.lookMesh.position.x -= this.cameraSpeed;
        }
        if (this.moveRight) {
            this.camera.rotation.y -= this.cameraSpeed;
            this.lookMesh.position.x += this.cameraSpeed;
        }

        this.camera.position.copy(this.lookMesh.position);
        // this.controls.target = this.camera.position;

        this.render();
    }
    render() {
        // this.controls.update();
        this.renderer.render( this.scene, this.camera );
    }
    resize() {
        // console.log('resize');
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.render();
    }
}

export default threeMotion;