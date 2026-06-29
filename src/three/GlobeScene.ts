import * as THREE from 'three';

const ATMOSPHERE_VERTEX = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT = `
  uniform vec3 uAtmosphereColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vPosition;
  void main() {
    float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    float viewFade = 1.0 - smoothstep(0.0, 5.0, length(vPosition));
    gl_FragColor = vec4(uAtmosphereColor, intensity * uIntensity * viewFade);
  }
`;

interface RouteData {
  start: [number, number];
  end: [number, number];
  color: number;
}

export class GlobeScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private globe!: THREE.Mesh;
  private atmosphere!: THREE.Mesh;
  private routes: THREE.Group;
  private markers: THREE.Group;
  private stars!: THREE.Points;
  private clock: THREE.Clock;
  private animationId: number = 0;
  private container: HTMLElement;
  private isActive: boolean = true;
  private routeData: RouteData[];

  constructor(container: HTMLElement) {
    this.container = container;
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.routes = new THREE.Group();
    this.markers = new THREE.Group();

    const aspect = container.clientWidth / container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 14);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    container.appendChild(this.renderer.domElement);

    this.routeData = [
      { start: [31.5, 74.3], end: [25.2, 55.3], color: 0x00d4ff }, // PK → UAE
      { start: [31.5, 74.3], end: [51.5, -0.1], color: 0x00d4ff }, // PK → UK
      { start: [31.5, 74.3], end: [40.7, -74.0], color: 0x00d4ff }, // PK → US
      { start: [31.5, 74.3], end: [37.8, -122.4], color: 0x00d4ff }, // PK → SF
      { start: [31.5, 74.3], end: [52.5, 13.4], color: 0x00d4ff }, // PK → DE
      { start: [31.5, 74.3], end: [-33.9, 151.2], color: 0x00d4ff }, // PK → AU
      { start: [31.5, 74.3], end: [43.7, -79.4], color: 0x00d4ff }, // PK → CA
      { start: [31.5, 74.3], end: [52.4, 4.9], color: 0x00d4ff }, // PK → NL
      { start: [31.5, 74.3], end: [1.4, 103.8], color: 0x00d4ff }, // PK → SG
      { start: [31.5, 74.3], end: [24.7, 46.7], color: 0x00d4ff }, // PK → SA
      { start: [31.5, 74.3], end: [41.0, 28.9], color: 0x00d4ff }, // PK → TR
    ];

    this.createGlobe();
    this.createStars();
    this.scene.add(this.routes);
    this.scene.add(this.markers);
    this.addLights();
    this.addEventListeners();
    this.animate();
  }

  private createGlobe() {
    const radius = 3.5;

    // Main globe
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshPhongMaterial({
      color: 0x0a1628,
      emissive: 0x051020,
      shininess: 10,
      transparent: true,
      opacity: 0.95,
    });

    // Try to load earth texture
    textureLoader.load(
      '/earth-texture.jpg',
      (texture) => {
        material.map = texture;
        material.emissiveMap = texture;
        material.emissive = new THREE.Color(0x112244);
        material.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback: just use the colored material
      }
    );

    this.globe = new THREE.Mesh(geometry, material);
    this.scene.add(this.globe);

    // Atmosphere
    const atmosGeometry = new THREE.SphereGeometry(radius * 1.05, 64, 64);
    const atmosMaterial = new THREE.ShaderMaterial({
      vertexShader: ATMOSPHERE_VERTEX,
      fragmentShader: ATMOSPHERE_FRAGMENT,
      uniforms: {
        uAtmosphereColor: { value: new THREE.Color(0x2563eb) },
        uIntensity: { value: 0.15 },
      },
      transparent: true,
      side: THREE.BackSide,
      blending: THREE.NormalBlending,
    });
    this.atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
    this.scene.add(this.atmosphere);
  }

  private addLights() {
    const ambient = new THREE.AmbientLight(0x93c5fd, 0.7);
    this.scene.add(ambient);

    const directional = new THREE.DirectionalLight(0xffffff, 1.5);
    directional.position.set(5, 3, 5);
    this.scene.add(directional);
  }

  private createStars() {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 20 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0x93c5fd,
      size: 0.04,
      transparent: true,
      opacity: 0.15,
      blending: THREE.NormalBlending,
    });
    this.stars = new THREE.Points(geometry, material);
    this.scene.add(this.stars);
  }

  private latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
    const latRad = (lat * Math.PI) / 180;
    const lonRad = (lon * Math.PI) / 180;
    return new THREE.Vector3(
      -radius * Math.cos(latRad) * Math.sin(lonRad),
      radius * Math.sin(latRad),
      radius * Math.cos(latRad) * Math.cos(lonRad)
    );
  }

  public createRoutes() {
    this.routeData.forEach((route, index) => {
      const start = this.latLonToVec3(route.start[0], route.start[1], 3.5);
      const end = this.latLonToVec3(route.end[0], route.end[1], 3.5);

      // Bezier control point
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(5.5);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const tubeGeometry = new THREE.TubeGeometry(curve, 32, 0.02, 8, false);
      const tubeMaterial = new THREE.MeshBasicMaterial({
        color: route.color,
        transparent: true,
        opacity: 0,
      });
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      tube.name = `route-${index}`;
      this.routes.add(tube);

      // Traveling particle
      const particleGeometry = new THREE.SphereGeometry(0.04, 8, 8);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: 0x55eeff,
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      particle.name = `route-particle-${index}`;
      particle.userData = { curve, speed: 0.3 + Math.random() * 0.2, t: Math.random() };
      this.routes.add(particle);
    });

    // Create markers
    const allLocations = [
      { lat: 31.5, lon: 74.3, color: 0xffb347, size: 1.5, label: 'HQ' },
      { lat: 25.2, lon: 55.3, color: 0x00d4ff, size: 0.8, label: '' },
      { lat: 51.5, lon: -0.1, color: 0x00d4ff, size: 0.8, label: '' },
      { lat: 40.7, lon: -74.0, color: 0x00d4ff, size: 0.8, label: '' },
      { lat: 37.8, lon: -122.4, color: 0x00d4ff, size: 0.8, label: '' },
      { lat: 52.5, lon: 13.4, color: 0x00d4ff, size: 0.8, label: '' },
      { lat: -33.9, lon: 151.2, color: 0x00d4ff, size: 0.8, label: '' },
      { lat: 43.7, lon: -79.4, color: 0x00d4ff, size: 0.8, label: '' },
      { lat: 52.4, lon: 4.9, color: 0x00d4ff, size: 0.8, label: '' },
      { lat: 1.4, lon: 103.8, color: 0x00d4ff, size: 0.8, label: '' },
      { lat: 24.7, lon: 46.7, color: 0x00d4ff, size: 0.8, label: '' },
      { lat: 41.0, lon: 28.9, color: 0x00d4ff, size: 0.8, label: '' },
    ];

    allLocations.forEach((loc) => {
      const pos = this.latLonToVec3(loc.lat, loc.lon, 3.52);
      const markerGeometry = new THREE.CylinderGeometry(0.05 * loc.size, 0.05 * loc.size, 0.15 * loc.size, 8);
      const markerMaterial = new THREE.MeshBasicMaterial({
        color: loc.color,
      });
      const marker = new THREE.Mesh(markerGeometry, markerMaterial);
      marker.position.copy(pos);
      marker.lookAt(new THREE.Vector3(0, 0, 0));
      marker.rotateX(Math.PI / 2);
      this.markers.add(marker);
    });
  }

  public revealRoutes(progress: number) {
    const totalRoutes = this.routeData.length;
    this.routes.children.forEach((child) => {
      if (child.name?.startsWith('route-') && !child.name?.startsWith('route-particle')) {
        const idx = parseInt(child.name.split('-')[1]);
        const triggerPoint = idx / totalRoutes;
        const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (progress > triggerPoint) {
          mat.opacity = Math.min(0.3, (progress - triggerPoint) * 3);
        }
      }
    });
  }

  private addEventListeners() {
    window.addEventListener('resize', this.onResize);
  }

  private onResize = () => {
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  private animate = () => {
    if (!this.isActive) return;
    this.animationId = requestAnimationFrame(this.animate);

    const elapsed = this.clock.getElapsedTime();

    // Globe rotation
    if (this.globe) {
      this.globe.rotation.y = elapsed * 0.05;
    }
    if (this.atmosphere) {
      this.atmosphere.rotation.y = elapsed * 0.05;
    }

    // Stars twinkle
    if (this.stars) {
      this.stars.rotation.y = elapsed * 0.001;
    }

    // Animate route particles
    this.routes.children.forEach((child) => {
      if (child.name?.startsWith('route-particle')) {
        const data = child.userData;
        data.t += data.speed * 0.01;
        if (data.t > 1) data.t = 0;
        const pos = data.curve.getPointAt(data.t);
        child.position.copy(pos);
      }
    });

    // Marker pulse
    this.markers.children.forEach((marker, i) => {
      const scale = 1 + Math.sin(elapsed * 2 + i) * 0.15;
      marker.scale.set(scale, 1, scale);
    });

    this.renderer.render(this.scene, this.camera);
  };

  public setCameraOrbit(longitude: number) {
    const rad = (longitude * Math.PI) / 180;
    this.camera.position.x = Math.sin(rad) * 14;
    this.camera.position.z = Math.cos(rad) * 14;
    this.camera.lookAt(0, 0, 0);
  }

  public dispose() {
    this.isActive = false;
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
