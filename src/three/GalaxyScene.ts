import * as THREE from 'three';

const GALAXY_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uSize;
  attribute float aScale;
  attribute vec3 aRandomness;
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    vec3 pos = position;
    pos += aRandomness * uTime * 0.15;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = uSize * aScale * (30.0 / -mvPosition.z);
    vColor = aColor;
  }
`;

const GALAXY_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  varying vec3 vColor;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float strength = 1.0 - (dist * 2.0);
    strength = pow(strength, 3.0);
    vec3 finalColor = uColor * vColor;
    gl_FragColor = vec4(finalColor, strength);
  }
`;

export class GalaxyScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private galaxy!: THREE.Points;
  private galaxyMaterial!: THREE.ShaderMaterial;
  private clock: THREE.Clock;
  private mouse: { x: number; y: number } = { x: 0, y: 0 };
  private targetRotation: { x: number; y: number } = { x: 0, y: 0 };
  private animationId: number = 0;
  private container: HTMLElement;
  private isActive: boolean = true;

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0b0f14, 0.02);

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    this.camera.position.set(0, 3, 8);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    container.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();

    this.createGalaxy();
    this.createAmbientElements();
    this.addEventListeners();
    this.animate();
  }

  private createGalaxy() {
    const parameters = {
      count: 30000,
      arms: 3,
      armWidth: 0.3,
      radius: 15,
      spin: 2,
    };

    const positions = new Float32Array(parameters.count * 3);
    const colors = new Float32Array(parameters.count * 3);
    const scales = new Float32Array(parameters.count);
    const randomness = new Float32Array(parameters.count * 3);

    const colorInside = new THREE.Color('#29E6F6');
    const colorMid = new THREE.Color('#2563EB');
    const colorOutside = new THREE.Color('#D8DCE3');

    for (let i = 0; i < parameters.count; i++) {
      const i3 = i * 3;
      const radius = Math.random() * parameters.radius;
      const spinAngle = radius * parameters.spin;
      const armAngle = (i % parameters.arms) * ((Math.PI * 2) / parameters.arms);
      const randomX = (Math.random() - 0.5) * parameters.armWidth * (radius / parameters.radius) * 4;
      const randomY = (Math.random() - 0.5) * 0.3 * (radius / parameters.radius);
      const randomZ = (Math.random() - 0.5) * parameters.armWidth * (radius / parameters.radius) * 4;

      positions[i3] = Math.cos(armAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(armAngle + spinAngle) * radius + randomZ;

      const mixedColor = colorInside.clone();
      if (radius < parameters.radius * 0.5) {
        mixedColor.lerp(colorMid, radius / (parameters.radius * 0.5));
      } else {
        mixedColor.lerp(colorOutside, (radius - parameters.radius * 0.5) / (parameters.radius * 0.5));
      }
      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      scales[i] = 0.5 + Math.random() * 1.5;

      randomness[i3] = (Math.random() - 0.5) * 0.1;
      randomness[i3 + 1] = (Math.random() - 0.5) * 0.1;
      randomness[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));

    this.galaxyMaterial = new THREE.ShaderMaterial({
      vertexShader: GALAXY_VERTEX_SHADER,
      fragmentShader: GALAXY_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 1.2 },
        uColor: { value: new THREE.Color('#29E6F6') },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      vertexColors: false,
    });

    this.galaxy = new THREE.Points(geometry, this.galaxyMaterial);
    this.scene.add(this.galaxy);

    // Center glow
    const glowGeometry = new THREE.SphereGeometry(2, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x2563eb,
      transparent: true,
      opacity: 0.05,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    this.scene.add(glow);
  }

  private createAmbientElements() {
    // Energy rings
    for (let i = 0; i < 5; i++) {
      const ringGeometry = new THREE.TorusGeometry(
        5 + Math.random() * 10,
        0.02,
        8,
        64
      );
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x29e6f6,
        transparent: true,
        opacity: 0.06,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 20 - 10
      );
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      ring.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.002,
        rotSpeedY: (Math.random() - 0.5) * 0.002,
      };
      this.scene.add(ring);
    }

    // Floating particles (ambient dust)
    const dustCount = 1000;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 60;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      dustSizes[i] = Math.random() * 2;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeometry.setAttribute('size', new THREE.BufferAttribute(dustSizes, 1));

    const dustMaterial = new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 0.05,
      transparent: true,
      opacity: 0.15,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
    });
    const dust = new THREE.Points(dustGeometry, dustMaterial);
    dust.name = 'ambientDust';
    this.scene.add(dust);
  }

  private addEventListeners() {
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove);
  }

  private onResize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private onMouseMove = (e: MouseEvent) => {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  };

  private animate = () => {
    if (!this.isActive) return;
    this.animationId = requestAnimationFrame(this.animate);

    const elapsedTime = this.clock.getElapsedTime();

    // Update galaxy
    if (this.galaxyMaterial) {
      this.galaxyMaterial.uniforms.uTime.value = elapsedTime;
    }

    // Galaxy rotation with mouse influence
    this.targetRotation.y = this.mouse.x * 0.05;
    this.targetRotation.x = this.mouse.y * 0.05;

    if (this.galaxy) {
      this.galaxy.rotation.y += 0.001 + this.mouse.x * 0.0003;
      this.galaxy.rotation.x += (this.targetRotation.x - this.galaxy.rotation.x) * 0.02;
    }

    // Animate energy rings
    this.scene.children.forEach((child) => {
      if (child.userData.rotSpeedX) {
        child.rotation.x += child.userData.rotSpeedX;
        child.rotation.y += child.userData.rotSpeedY;
      }
    });

    // Ambient dust rotation
    const dust = this.scene.getObjectByName('ambientDust');
    if (dust) {
      dust.rotation.y = elapsedTime * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  };

  public setCameraPosition(x: number, y: number, z: number) {
    this.camera.position.set(x, y, z);
  }

  public getCamera() {
    return this.camera;
  }

  public getScene() {
    return this.scene;
  }

  public getRenderer() {
    return this.renderer;
  }

  public setGalaxyOpacity(opacity: number) {
    if (this.galaxyMaterial) {
      this.galaxyMaterial.opacity = opacity;
    }
  }

  public dispose() {
    this.isActive = false;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
