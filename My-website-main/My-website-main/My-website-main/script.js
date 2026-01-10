// Sidebar Toggle
function toggleSubmenu(e) {
  e.preventDefault();
  const li = e.target.closest('.dropdown-item');
  const sub = li.querySelector('.submenu');
  const chev = li.querySelector('.chevron');
  li.classList.toggle('active');
  if (li.classList.contains('active')) {
    sub.classList.add('open');
    chev.style.transform = 'rotate(90deg)';
  } else {
    sub.classList.remove('open');
    chev.style.transform = 'rotate(0deg)';
  }
}

// Discord Member Count Fetcher - Live Count (Online + Total Members)
async function updateDiscordMemberCount() {
  const onlineCountElements = document.querySelectorAll('.online-count');
  const totalCountElements = document.querySelectorAll('.total-count');
  
  if (onlineCountElements.length === 0 && totalCountElements.length === 0) return;
  
  // Discord invite code from your invite link
  const inviteCode = 'PCZU4fM27s';
  // Discord Bot Token (Security Note: Frontend me token expose hota hai - better: backend proxy use karein)
  const botToken = 'MTQ0ODA3NTE2NTA0Nzk4MDA5Mg.GlsFip.xg2cgl6J3tas7TmkjvR6HhoSqLZGZ1LWH-hMiI';
  
  // Method 1: Try with Bot Token (most reliable)
  try {
    const apiUrl = `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      const onlineCount = data.approximate_presence_count || 0;
      const totalCount = data.approximate_member_count || 0;
      
      // Format numbers with commas
      const formattedOnline = onlineCount.toLocaleString();
      const formattedTotal = totalCount.toLocaleString();
      
      // Update all online counts
      onlineCountElements.forEach(element => {
        element.textContent = formattedOnline;
        element.style.transition = 'opacity 0.2s';
        element.style.opacity = '0.7';
        setTimeout(() => {
          element.style.opacity = '1';
        }, 200);
      });
      
      // Update all total counts
      totalCountElements.forEach(element => {
        element.textContent = formattedTotal;
        element.style.transition = 'opacity 0.2s';
        element.style.opacity = '0.7';
        setTimeout(() => {
          element.style.opacity = '1';
        }, 200);
      });
      
      // Store in localStorage for fallback
      localStorage.setItem('discordOnlineCount', onlineCount);
      localStorage.setItem('discordTotalCount', totalCount);
      localStorage.setItem('discordCountTimestamp', Date.now().toString());
      
      console.log(`✅ Discord Count Updated (With Token): ${onlineCount} Online, ${totalCount} Total`);
      return;
    }
  } catch (tokenError) {
    console.log('Bot token method failed, trying CORS proxy...');
  }
  
  // Method 2: Try with CORS proxy (fallback)
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`)}`;
    
    const proxyResponse = await fetch(proxyUrl);
    
    if (proxyResponse.ok) {
      const proxyData = await proxyResponse.json();
      const data = JSON.parse(proxyData.contents);
      
      const onlineCount = data.approximate_presence_count || 0;
      const totalCount = data.approximate_member_count || 0;
      
      const formattedOnline = onlineCount.toLocaleString();
      const formattedTotal = totalCount.toLocaleString();
      
      onlineCountElements.forEach(element => {
        element.textContent = formattedOnline;
        element.style.transition = 'opacity 0.2s';
        element.style.opacity = '0.7';
        setTimeout(() => {
          element.style.opacity = '1';
        }, 200);
      });
      
      totalCountElements.forEach(element => {
        element.textContent = formattedTotal;
        element.style.transition = 'opacity 0.2s';
        element.style.opacity = '0.7';
        setTimeout(() => {
          element.style.opacity = '1';
        }, 200);
      });
      
      localStorage.setItem('discordOnlineCount', onlineCount);
      localStorage.setItem('discordTotalCount', totalCount);
      localStorage.setItem('discordCountTimestamp', Date.now().toString());
      
      console.log(`✅ Discord Count Updated (Proxy): ${onlineCount} Online, ${totalCount} Total`);
      return;
    }
  } catch (proxyError) {
    console.log('CORS proxy method failed, trying direct API...');
  }
  
  // Method 3: Try direct API call without token
  try {
    const apiUrl = `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      const data = await response.json();
      const onlineCount = data.approximate_presence_count || 0;
      const totalCount = data.approximate_member_count || 0;
      
      const formattedOnline = onlineCount.toLocaleString();
      const formattedTotal = totalCount.toLocaleString();
      
      onlineCountElements.forEach(element => {
        element.textContent = formattedOnline;
        element.style.transition = 'opacity 0.2s';
        element.style.opacity = '0.7';
        setTimeout(() => {
          element.style.opacity = '1';
        }, 200);
      });
      
      totalCountElements.forEach(element => {
        element.textContent = formattedTotal;
        element.style.transition = 'opacity 0.2s';
        element.style.opacity = '0.7';
        setTimeout(() => {
          element.style.opacity = '1';
        }, 200);
      });
      
      localStorage.setItem('discordOnlineCount', onlineCount);
      localStorage.setItem('discordTotalCount', totalCount);
      localStorage.setItem('discordCountTimestamp', Date.now().toString());
      
      console.log(`✅ Discord Count Updated (Direct): ${onlineCount} Online, ${totalCount} Total`);
      return;
    }
  } catch (error) {
    console.log('Direct API call also failed:', error);
  }
  
  // Method 4: Fallback to cached value (max 1 minute old)
  const cachedOnline = localStorage.getItem('discordOnlineCount');
  const cachedTotal = localStorage.getItem('discordTotalCount');
  const cachedTime = localStorage.getItem('discordCountTimestamp');
  
  if (cachedOnline && cachedTotal && cachedTime) {
    const age = Date.now() - parseInt(cachedTime);
    if (age < 60000) { // 1 minute
      const formattedOnline = parseInt(cachedOnline).toLocaleString();
      const formattedTotal = parseInt(cachedTotal).toLocaleString();
      
      onlineCountElements.forEach(element => {
        element.textContent = formattedOnline;
      });
      
      totalCountElements.forEach(element => {
        element.textContent = formattedTotal;
      });
      
      console.log(`📦 Using cached count: ${cachedOnline} Online, ${cachedTotal} Total`);
      return;
    }
  }
  
  console.log('⚠️ All methods failed, keeping default values');
}

// Mobile Sidebar Toggle
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const sidebar = document.querySelector('.left-sidebar');
  if (!header || !sidebar) return;

  let toggleBtn = header.querySelector('.menu-toggle');
  if (!toggleBtn) {
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle';
    toggleBtn.setAttribute('aria-label', 'Toggle navigation');
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    header.insertBefore(toggleBtn, header.firstChild);
  }

  let overlay = document.querySelector('.menu-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
  }

  const closeSidebar = () => document.body.classList.remove('sidebar-open');

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('sidebar-open');
  });

  overlay.addEventListener('click', closeSidebar);
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });
  
  // Update Discord member count on page load
  updateDiscordMemberCount();
  
  // Update every 5 seconds for live count
  setInterval(updateDiscordMemberCount, 5000);
});

// Products
const products = [
  {id: 2, title: "Baga Rain Generator", image: "Blender/Addon/Baga Rain Generator.png", description: "Create stunning realistic rain and weather effects with procedural generation. Features customizable rain density, wind direction, splash effects, and particle systems. Includes preset weather conditions from light drizzle to heavy storms. Optimize your scenes with built-in performance controls for real-time rendering.", category: "blender-addons", download: "https://link-target.net/1422046/AeS1HLNh2V1b"},
  {id: 3, title: "Baga River Generator", image: "Blender/Addon/Baga River Generator.jpg", description: "Advanced procedural river and water body generation system for natural landscapes. Create flowing rivers, streams, and waterways with realistic curves and terrain erosion. Features automatic bank generation, water flow dynamics, and foam effects. Perfect for environment artists and landscape designers.", category: "blender-addons", download: "https://link-target.net/1422046/cXrZ6HRd4tMP"},
  {id: 4, title: "Car Library - Traffiq Car Models", image: "Blender/Addon/Car Library - Traffiq Car Models.png", description: "Extensive library of over 150+ high-quality, photo-realistic car models for traffic simulation and urban scenes. Includes sedans, SUVs, trucks, sports cars, and commercial vehicles. All models are optimized for performance with LOD support. Features one-click placement and randomization tools for creating believable traffic scenarios.", category: "blender-addons", download: "https://link-target.net/1422046/YmCShYFgW29E"},
  {id: 5, title: "Cyberscape Pro Procedural City Generator", image: "Blender/Addon/Cyberscape Pro  Procedural City Generator.jpg", description: "Next-generation procedural city generator with stunning cyberpunk and futuristic aesthetics. Create sprawling sci-fi metropolises with neon lights, holographic billboards, and towering skyscrapers. Features advanced customization for building density, street layouts, and atmospheric effects. Perfect for creating Blade Runner-style environments and dystopian cityscapes.", category: "blender-addons", download: "https://link-hub.net/1422046/IldhJ0tYdpZr"},
  {id: 6, title: "Divine Cut Smart Cloth Generator V3", image: "Blender/Addon/Divine Cut Smart Cloth Generator V3.jpg", description: "Revolutionary cloth simulation and garment creation tool with AI-powered pattern generation. Create realistic clothing, drapes, and fabric with automatic seam detection and physics-based wrinkles. Features smart cutting patterns, material presets, and real-time cloth dynamics. Ideal for fashion design, character clothing, and textile visualization.", category: "blender-addons", download: "https://link-hub.net/1422046/ATt7wkiDN5GR"},
  {id: 7, title: "The City Generator", image: "Blender/Addon/The City Generator.jpg", description: "Powerful procedural city building tool for creating realistic urban landscapes and metropolitan areas. Generate complete cities with roads, buildings, parks, and infrastructure in minutes. Features customizable architectural styles, zoning controls, and population density settings. Includes traffic system, street lights, and environmental details for photorealistic renders.", category: "blender-addons", download: "https://link-center.net/1422046/vkp1bDjvkOkb"},
  {id: 8, title: "G Trash", image: "Blender/Addon/G Trash.jpg", description: "Procedural trash and debris scatter system for adding realism to urban and apocalyptic environments. Includes hundreds of trash items: bottles, cans, papers, bags, and rubble. Features smart placement algorithms that follow surfaces and corners naturally. Perfect for post-apocalyptic scenes, alleyways, abandoned buildings, and gritty urban settings.", category: "blender-addons", download: "https://link-hub.net/1422046/2dXkNf0Xm5eV"},
  {id: 9, title: "Inkwood 2.0 - Ink Drawing Shader Pack", image: "Blender/Addon/Inkwood 2.0 - Ink Drawing Shader Pack.jpg", description: "Professional ink and pen shader collection for stunning non-photorealistic rendering and artistic styles. Create hand-drawn, manga, comic book, and sketch effects. Features customizable line weights, hatching patterns, and ink bleeding effects. Includes 50+ preset styles from technical drawing to watercolor ink. Real-time viewport preview for instant feedback.", category: "blender-addons", download: "https://link-center.net/1422046/lSxrs9q1z9fx"},
  {id: 10, title: "One Click Slow Motion", image: "Blender/Addon/One click slow motion.jpg", description: "Effortless slow-motion effect creator with professional motion blur and time-remapping controls. Generate smooth slow-mo sequences from any animation with a single click. Features automatic interpolation, velocity-based motion blur, and frame blending. Perfect for action sequences, bullet time effects, and cinematic moments. Maintains animation quality at any speed.", category: "blender-addons", download: "https://link-hub.net/1422046/sFDGXVXj2361"},
  {id: 11, title: "Procedural Crowds PRO", image: "Blender/Addon/Procedural Crowds PRO.jpg", description: "Advanced crowd simulation and character population system for creating massive groups of people. Features AI-driven navigation, collision avoidance, and realistic crowd behaviors. Includes diverse character library with customizable clothing and animations. Perfect for stadium scenes, city streets, concerts, and any scenario requiring large crowds. Optimized performance handles thousands of agents.", category: "blender-addons", download: "https://link-hub.net/1422046/1oAYTph5i1bk"},
  {id: 12, title: "Simply Material Fashion Design", image: "Blender/Addon/Simply Material Fashion Design.jpg", description: "Complete fashion design toolkit with 200+ professional fabric materials and texture presets. Includes silk, cotton, leather, denim, wool, and synthetic fabrics with realistic properties. Features pattern mapping tools, color variation controls, and wrinkle generation. Perfect for fashion designers, character artists, and product visualization. Export-ready materials for game engines and rendering.", category: "blender-addons", download: "https://link-center.net/1422046/oh699AXXXLFA"},
  {id: 13, title: "Alt Tab Easy Fog 2", image: "Blender/Addon/Alt Tab Easy Fog 2.png", description: "Create stunning atmospheric fog and volumetric effects with intuitive one-click controls. Features gradient fog, ground fog, light scattering, and god rays. Includes preset atmospheres from light mist to dense smoke. Real-time viewport feedback and render-optimized settings. Perfect for moody landscapes, horror scenes, and cinematic lighting. Compatible with Cycles and Eevee.", category: "blender-addons", download: "https://link-center.net/1422046/FaYY5g31u69Z"},
  {id: 14, title: "Auto Building", image: "Blender/Addon/Auto building.jpg", description: "Automated building generation tool powered by geometry nodes for rapid architectural visualization. Create complete buildings from simple floor plans with automatic window placement, balconies, and structural details. Features parametric controls for floors, facades, and architectural styles. Includes modern, classical, and industrial building presets. Generate entire city blocks in minutes with variation controls.", category: "blender-addons", download: "https://link-center.net/1422046/bMxoxTDNbUtQ"},
  {id: 15, title: "Camera Tracker", image: "Blender/Addon/Camera tracker.jpg", description: "Professional camera tracking and motion tracking solution for seamless VFX integration. Automatic feature detection, 3D camera solving, and object tracking capabilities. Features marker refinement tools, distortion correction, and stabilization controls. Perfect for matching CG elements with live-action footage. Supports multi-camera setups and provides detailed solve information for quality assurance.", category: "blender-addons", download: "https://link-target.net/1422046/r0LibR42Qosf"},
  {id: 16, title: "Human Generator Ultimate", image: "Blender/Addon/Human Generator Ultimate.jpg", description: "Complete human character generation system with extensive customization and realistic anatomy. Create diverse characters with adjustable body types, facial features, skin tones, and proportions. Includes automatic rigging, clothing library, and hair systems. Features morphing controls for age, gender, and ethnicity. Perfect for character artists, game developers, and architectural visualization requiring realistic human models.", category: "blender-addons", download: "https://link-center.net/1422046/oWwiYp3cDj0A"},
  {id: 17, title: "Icity City Generator Addon 1.6", image: "Blender/Addon/Icity City Generator Addon 1.6.jpg", description: "Procedural city generation addon for creating detailed urban landscapes with realistic infrastructure. Generate cities with customizable road networks, building types, and urban planning. Features smart zoning system, traffic simulation, and environmental details like parks and plazas. Includes day/night lighting presets and population density controls. Export-ready models optimized for real-time engines and rendering.", category: "blender-addons", download: "https://link-target.net/1422046/aLaaMz0DBvH6"},
  {id: 18, title: "Sanctus Library", image: "Blender/Addon/Sanctus Library.jpg", description: "Comprehensive 3D asset library with 1000+ high-quality models for architectural and interior design. Includes furniture, decor, lighting fixtures, appliances, and architectural elements. All assets are UV-mapped with PBR materials. Features smart placement tools, material swapping, and size adjustments. Regular monthly updates with new content. Perfect for archviz, interior design, and environmental art.", category: "blender-addons", download: "https://link-target.net/1422046/brMTxtyyGIpv"},
  {id: 20, title: "Xdecal™ Manager", image: "Blender/Addon/Xdecal™ Manager.jpg", description: "Professional decal management system for efficient texture projection and surface detailing. Features instant decal placement, blending modes, and trim sheets support. Includes library of 500+ decals: dirt, scratches, labels, graffiti, and weathering. Smart UV projection ensures optimal texture resolution. Perfect for hard surface modeling, environment art, and adding wear and tear to any surface. Real-time preview in viewport.", category: "blender-addons", download: "https://link-center.net/1422046/elMXn2xWNXLi"},
  {id: 21, title: "Organic Addon - Procedural Organic Tools", image: "Blender/Addon/Organic Addon - Procedural Organic Tools.png", description: "Advanced procedural modeling toolkit for creating natural organic forms and biological structures. Generate trees, plants, corals, crystals, and abstract organic shapes with procedural controls. Features growth algorithms, branching systems, and natural variation. Includes presets for various natural phenomena and sci-fi organic elements. Perfect for environment design, fantasy landscapes, and alien world creation.", category: "blender-addons", download: "https://linkvertise.com/1422046/nbno35tX6QrF?o=sharing"},
  {id: 22, title: "Auto-Rig Pro Rig Library", image: "Blender/Addon/Auto-Rig Pro Rig Library.png", description: "Professional character rigging library with production-ready rigs for various creature types. Includes biped, quadruped, bird, fish, and custom creature rig templates. Features automatic weight painting, IK/FK switching, and facial rigging controls. Compatible with motion capture data and includes animation-ready poses. Streamline your rigging workflow with one-click setup and customization options.", category: "blender-addons", download: "https://link-target.net/1422046/jaMRrkGgn3h2"},
  {id: 23, title: "Blender Addon 3D Hair Brush - Support New Hair System", image: "Blender/Addon/Blender Addon 3D Hair Brush - Support New Hair System.jpg", description: "Advanced 3D hair sculpting brush fully compatible with Blender's new hair system. Create realistic hair strands, fur, and fiber with natural-looking flow and volume. Features density control, strand clumping, and physics-based styling. Includes preset hairstyles and grooming tools for quick results. Perfect for character hair, animal fur, grass, and any fibrous surface. Real-time viewport display for instant feedback.", category: "blender-addons", download: "https://link-center.net/1422046/FjOi6rmx2OtO"},
  {id: 24, title: "Faceit", image: "Blender/Addon/Faceit.png", description: "Professional facial rigging and animation toolkit for expressive character performances. Automatic facial landmark detection, blend shape generation, and ARKit compatibility. Features 50+ facial expressions, lip-sync tools, and corrective shape sculpting. Includes motion capture support and real-time facial tracking. Perfect for character animators, game developers, and anyone creating believable facial animations. Simple workflow from mesh to animated face.", category: "blender-addons", download: "https://link-target.net/1422046/8XcBBMtKq82d"},
  {id: 25, title: "Globalskin - Ultimate Skin Shader", image: "Blender/Addon/Globalskin - Ultimate Skin Shader.jpg", description: "Industry-standard skin shader system for ultra-realistic human character rendering. Features subsurface scattering, pore details, micro-surface variation, and realistic skin tones. Includes age maps, ethnicity presets, and makeup controls. Advanced settings for oil, sweat, and translucency effects. Perfect for character artists, portrait renders, and medical visualization. Compatible with both Cycles and Eevee with optimized performance.", category: "blender-addons", download: "https://link-hub.net/1422046/INGaVBMU5M2H"},
  {id: 26, title: "Vera Light Studio", image: "Blender/Addon/Vera Light Studio.jpg", description: "Advanced lighting studio environment for professional product and character photography. Features over 100+ studio lighting setups including softboxes, ring lights, rim lights, and colored gels. Interactive light positioning with real-time preview. Includes HDR backdrops and reflector controls. Perfect for product visualization, portrait lighting, and commercial renders. Save and load custom lighting configurations for consistent results.", category: "blender-addons", download: "https://link-target.net/1422046/QgSqdjZczSA6"},
  {id: 27, title: "BlendBricks", image: "Blender/Addon/blendbricks.jpg", description: "Modular building system for quick architectural design using parametric brick-based construction. Create buildings, walls, and structures with LEGO-style modular pieces. Features snap-to-grid placement, automatic connection detection, and structural integrity checking. Includes extensive brick library with different sizes and special pieces. Perfect for rapid prototyping, game level design, and architectural concept modeling. Export to game engines with optimized mesh.", category: "blender-addons", download: "https://direct-link.net/1422046/u37cTEnF7xCS"},
  {id: 28, title: "Aqua Under Water", image: "Blender/Addon/Aqua Under Water.png", description: "Professional underwater environment creation toolkit with realistic water caustics and ocean floor generation. Create stunning underwater scenes with volumetric lighting, particle systems for bubbles and debris, and marine life animation tools. Features depth-based color grading, water turbidity controls, and procedural coral reef generation. Perfect for underwater cinematics, ocean exploration scenes, and aquatic environment design.", category: "blender-addons", download: "https://link-target.net/1422046/QgSqdjZczSA6"},
  {id: 29, title: "Blender Dynamic VFX - Elemental Asset Pack", image: "Blender/Addon/Blender Dynamic Vfx - Elemental Asset Pack.png", description: "Comprehensive elemental effects library featuring fire, water, electricity, smoke, and magical effects. Includes pre-animated VFX assets with customizable parameters for intensity, color, and movement. Features real-time simulation controls and render-optimized particle systems. Perfect for action scenes, fantasy environments, and cinematic visual effects. Compatible with both Cycles and Eevee rendering engines.", category: "blender-addons", download: "https://direct-link.net/1422046/qhn7o8sDMJzb"},
  {id: 30, title: "Node-it", image: "Blender/Addon/Node-it.jpg", description: "Advanced node-based workflow enhancement tool for streamlined shader and geometry node creation. Features auto-arrange nodes, quick presets library, and intelligent node connection suggestions. Includes hundreds of pre-built node groups for common materials and effects. Perfect for technical artists, shader developers, and anyone working with complex node networks. Dramatically speeds up material creation workflow.", category: "blender-addons", download: "https://direct-link.net/1422046/999VTpse9prg"},
  {id: 31, title: "Quad Remesher", image: "Blender/Addon/Quad Remesher.png", description: "Industry-leading automatic retopology tool that converts high-poly meshes to clean quad-based topology. Features intelligent edge flow detection, adjustable polygon density, and preservation of hard edges and UV seams. One-click solution for creating animation-ready and subdivision-friendly meshes. Perfect for character modeling, game asset optimization, and sculpting workflows. Saves hours of manual retopology work.", category: "blender-addons", download: "https://link-hub.net/1422046/osjrzja3mMaO"},
  {id: 32, title: "UVPackmaster 3", image: "Blender/Addon/uvpackmaster 3.png", description: "Ultimate UV packing solution with advanced algorithms for maximum texture space utilization. Features automatic island rotation, padding controls, and multi-object packing with intelligent grouping. Supports UDIM workflows and includes presets for different texture resolutions. Perfect for game developers, texture artists, and anyone optimizing UV layouts. Achieves up to 20% better packing efficiency than standard tools.", category: "blender-addons", download: "https://discord.com/channels/1383778525634629642/1436300762140508240/1436300811352145920"},
  {id: 33, title: "Wrap Gen - Generate Fully Customisable", image: "Blender/Addon/Wrap Gen - Generate Fully Customisable.jpg", description: "Procedural wrap and packaging generator for product visualization and branding projects. Create realistic product packaging, labels, shrink wrap, and packaging materials with full customization. Features automatic UV unwrapping, material presets for different packaging types, and physics-based wrinkle simulation. Perfect for product designers, marketing visualization, and e-commerce asset creation. Export-ready for photorealistic renders.", category: "blender-addons", download: "#"},
  {id: 34, title: "Hair Brick Pro", image: "Blender/Addon/Hair Brick Pro.jpg", description: "Professional hair creation system with modular brick-based approach for building complex hairstyles. Create realistic hair, fur, and grooming effects with customizable hair strands and styling controls. Features preset hairstyles, physics simulation, and color variation tools. Includes real-time viewport preview and render-optimized settings. Perfect for character artists, stylized characters, and realistic hair rendering. Compatible with Blender's native hair system.", category: "blender-addons", download: "https://direct-link.net/1422046/tFEkT8jR4nqz"},
  {id: 35, title: "Physics Placer", image: "Blender/Addon/Physics Placer.jpg", description: "Automated physics-based object placement tool for realistic scene population and asset scattering. Drop objects naturally onto surfaces with collision detection and physics simulation. Features randomization controls for rotation, scale, and positioning. Perfect for scattering rocks, debris, vegetation, and props across landscapes. Includes preset placement patterns and density controls. Saves hours of manual object placement work with realistic natural results.", category: "blender-addons", download: "https://link-center.net/1422046/rC4HLPjge4cy"},
  {id: 36, title: "Random Flow", image: "Blender/Addon/Random Flow.png", description: "Procedural randomization toolkit for creating natural variation and organic distribution patterns. Generate random flows, patterns, and distributions for textures, particles, and geometry. Features noise-based controls, seed randomization, and customizable distribution algorithms. Includes presets for various natural phenomena like water flow, wind patterns, and erosion effects. Perfect for creating realistic natural environments, abstract patterns, and procedural textures. Real-time preview with adjustable parameters.", category: "blender-addons", download: "https://direct-link.net/1422046/63FjeTvMLGOd"},
  {id: 37, title: "KeenTools FaceBuilder", image: "Blender/Addon/keentools facebuilder.png", description: "Professional facial modeling and reconstruction tool for creating photorealistic 3D faces from photographs. Advanced face tracking with automatic feature detection and landmark placement. Features morphing technology for customizable facial features, expressions, and head shapes. Includes real-time photo matching, multi-angle reconstruction, and texture projection capabilities. Perfect for character artists, portrait modeling, VFX facial recreation, and realistic human head creation. Streamlines facial modeling workflow with precision and speed.", category: "blender-addons", download: "https://link-target.net/1422046/fPJsWOcxFjcL"},
  {id: 38, title: "Breakdown Maker", image: "Blender/Addon/Breakdown Maker.jpg", description: "Advanced destruction and fracture system for creating realistic breakage and demolition effects. Features procedural fracture algorithms with customizable breaking patterns and physics-based simulation. Includes preset destruction types: glass shattering, concrete crumbling, and wood splintering. Supports particle emission and debris scattering for complete destruction sequences. Perfect for VFX shots, game assets, and architectural destruction visualization. Real-time preview with adjustable fracture parameters.", category: "blender-addons", download: "#"},
  {id: 39, title: "GeoTracker for Blender", image: "Blender/Addon/GeoTracker for Blender.png", description: "Professional motion tracking and geometry reconstruction tool for advanced VFX workflows. Features planar tracking, 3D camera solving, and automatic geometry reconstruction from video footage. Includes lens distortion correction, automatic feature detection, and robust solving algorithms. Perfect for integrating 3D elements into live-action footage, matchmoving, and complex VFX compositing. Industry-standard tracking solution for professional visual effects production.", category: "blender-addons", download: "#"},
  {id: 40, title: "HumanPro", image: "Blender/Addon/HumanPro.jpg", description: "Professional human character generation system with advanced anatomical accuracy and customization. Features detailed body proportions, muscle definition, and realistic skin textures with PBR materials. Includes extensive clothing library, hair systems, and pose presets for various activities. Supports automatic rigging with facial controls and body shape morphing. Perfect for character artists, animation studios, and realistic human modeling projects. Create photorealistic human characters with production-ready quality.", category: "blender-addons", download: "#"},
  {id: 101, title: "Fractal Machine", image: "Blender/Assets/Fractal Machine.png", description: "Advanced fractal generation system for creating infinite mathematical patterns and complex geometric structures. Features real-time procedural generation with customizable iteration depth, color gradients, and mathematical formulas. Includes famous fractal types like Mandelbrot, Julia sets, and Sierpinski patterns. Perfect for abstract art, sci-fi environments, alien landscapes, and mathematical visualizations. GPU-accelerated rendering for smooth real-time preview and animation capabilities.", category: "blender-assets", download: "https://link-target.net/1422046/P4jL9dXjn7ux"},
  {id: 102, title: "Gobos Light Textures", image: "Blender/Assets/Gobos Light Textures.jpg", description: "Professional collection of gobo light textures for cinematic lighting and atmospheric effects. Includes over 200+ high-resolution patterns simulating real-world lighting projections. Features window shadows, foliage patterns, geometric designs, and abstract shapes. Perfect for film production, architectural visualization, product photography, and dramatic scene lighting. Compatible with all rendering engines with easy-to-use material setups.", category: "blender-assets", download: "https://link-center.net/1422046/i9iUHq4NGZ2g"},
  {id: 103, title: "Moss Biome Ground Scatter - 3D Assetkit PBR", image: "Blender/Assets/Moss Biome Ground Scatter - 3D Assetkit Pbr.jpg", description: "Ultra-realistic moss biome ground scatter system with photogrammetry-scanned PBR assets. Features diverse moss varieties, rocks, fallen leaves, and forest floor elements. Includes automatic scattering tools with density controls and randomization. All assets feature 4K PBR textures with displacement maps for maximum realism. Perfect for forest environments, nature scenes, fantasy landscapes, and outdoor architectural visualization. Optimized for both Cycles and Eevee rendering.", category: "blender-assets", download: "https://direct-link.net/1422046/VWT0xcl57liq"},
  {id: 104, title: "Realistic Animation 10H + 100 Assets - The Oldest View", image: "Blender/Assets/Realistic Animation 10H + 100 Assets - The Oldest View.jpg", description: "Comprehensive animation library with over 10 hours of motion capture data and 100+ production-ready assets. Features realistic human movements including walking, running, sitting, fighting, and emotional expressions. Includes fully rigged characters, props, and environmental assets. All animations are professionally motion-captured and cleaned for immediate use. Perfect for game development, film production, architectural visualization, and character animation projects. Compatible with standard armature rigs.", category: "blender-assets", download: "https://link-center.net/1422046/bk0aJvytcxTG"},
  {id: 105, title: "Simply Trails - Trail Anything!", image: "Blender/Assets/Simply Trails - Trail Anything!.jpg", description: "Powerful trail generation system for creating dynamic motion trails and path effects. Generate trails from any moving object including particles, meshes, and curves. Features customizable width, color gradients, fade-out effects, and emission controls. Includes presets for magic effects, speed lines, light trails, and energy streams. Perfect for motion graphics, VFX shots, sci-fi effects, and dynamic visualizations. Real-time preview with animation support.", category: "blender-assets", download: "https://link-center.net/1422046/g0CvldVPC8Me"},
  {id: 106, title: "Stylized Tree Asset Generator", image: "Blender/Assets/Stylized Tree Asset Generator.png", description: "Procedural tree generation tool specialized in stylized and artistic tree designs. Create unique cartoon-style, low-poly, and hand-painted looking trees with full customization. Features branch shape controls, foliage density, seasonal variations, and color schemes. Includes preset styles for various art directions from cel-shaded to painterly aesthetics. Perfect for game environments, animated films, stylized renders, and artistic projects. Export-ready with optimized topology.", category: "blender-assets", download: "https://link-hub.net/1422046/XFikELDr55SY"},
  {id: 107, title: "Alpha Trees - Render Massive Forests, Fast", image: "Blender/Assets/Alpha Trees - Render Massive Forests, Fast.jpg", description: "Optimized alpha-based tree system for rendering massive forests with minimal performance impact. Uses advanced alpha transparency techniques to create dense forest scenes while maintaining fast render times. Features extensive tree variety, seasonal variations, and automatic LOD system. Includes wind animation and procedural placement tools. Perfect for large-scale environment design, open-world games, and cinematic landscape shots. Render thousands of trees efficiently.", category: "blender-assets", download: "https://link-target.net/1422046/S3DXvh39DByb"},
  {id: 108, title: "Arborea", image: "Blender/Assets/Arborea.png", description: "Comprehensive botanical asset library with scientifically accurate tree and plant models. Features photorealistic vegetation with detailed bark textures, leaf structures, and natural growth patterns. Includes deciduous and coniferous trees, shrubs, and ground plants. All assets feature PBR materials with seasonal variations and growth stages. Perfect for architectural visualization, environmental design, and nature documentaries. Create authentic natural environments with botanical precision.", category: "blender-assets", download: "https://link-hub.net/1422046/M5vmlAr6Y5KT"},
  {id: 109, title: "Dynamic Terrain", image: "Blender/Assets/Dynamic Terrain.jpg", description: "Advanced terrain generation system with real-time sculpting and procedural landscape creation. Features erosion simulation, layered texture painting, and automatic vegetation placement. Includes preset biomes: mountains, valleys, deserts, and coastal areas. Support for heightmap import and export for seamless workflow. Perfect for game level design, environmental art, and landscape visualization. Create realistic terrains with natural geological features and weathering effects.", category: "blender-assets", download: "https://link-target.net/1422046/E7NEJXb9jByB"},
  {id: 110, title: "Forest Generator Photorealistic Close-Up Ready Forests", image: "Blender/Assets/Forest Generator Photorealistic Close-Up Ready Forests.jpg", description: "Professional forest generation tool optimized for close-up photorealistic rendering. Creates detailed forest environments with high-quality tree models suitable for extreme close-ups. Features realistic bark detail, leaf translucency, and natural forest floor scatter. Includes automatic tree placement with realistic spacing and density variation. Perfect for film production, high-end architectural visualization, and detailed nature renders. Production-ready quality for demanding projects.", category: "blender-assets", download: "https://link-center.net/1422046/lx4IgLmRRYiq"},
  {id: 111, title: "Mountain Scapes", image: "Blender/Assets/Mountain Scapes.jpg", description: "Specialized mountain and alpine landscape asset collection with realistic geological formations. Features cliff faces, rocky outcrops, snow-covered peaks, and mountain terrain elements. Includes procedural rock generation with weathering effects and erosion patterns. All assets feature 4K PBR textures with displacement maps. Perfect for mountain environments, alpine scenes, fantasy landscapes, and outdoor adventure visualizations. Create dramatic mountainous terrain with authentic geological detail.", category: "blender-assets", download: "#"},
  {id: 112, title: "Omega Particle", image: "Blender/Assets/Omega Particle.jpg", description: "Advanced particle system for creating complex visual effects and simulations. Features customizable particle behaviors, collision dynamics, and force field interactions. Includes preset effects: explosions, smoke, fire, magic spells, and energy fields. Support for particle instancing and GPU acceleration for massive particle counts. Perfect for VFX shots, motion graphics, sci-fi effects, and dynamic simulations. Create stunning particle-based effects with full artistic control.", category: "blender-assets", download: "https://direct-link.net/1422046/HTpLLpSz2MZL"},
  {id: 113, title: "Painterly Grass Fields & Meadows Pack For Blender", image: "Blender/Assets/Painterly Grass Fields & Meadows Pack For Blender.png", description: "Artistic grass and meadow asset pack with stylized painterly aesthetic. Features hand-painted grass textures and stylized vegetation elements perfect for non-photorealistic rendering. Includes various grass types, wildflowers, and meadow plants with customizable colors and density. Optimized for NPR and cel-shaded styles. Perfect for animated films, stylized games, artistic renders, and cartoon environments. Create beautiful painterly landscapes with artistic flair.", category: "blender-assets", download: "https://link-hub.net/1422046/8pZqhxXwSq5n"},
  {id: 114, title: "Pro Particles - Advanced Particle System", image: "Blender/Assets/Pro Particles - Advanced Particle System.png", description: "Professional particle system with advanced control and simulation capabilities. Features fluid dynamics, rigid body integration, and complex particle behaviors. Includes caching system for efficient rendering and playback. Support for custom particle shapes, textures, and shading. Perfect for professional VFX work, fluid simulations, crowd systems, and complex dynamics. Industry-standard particle toolkit for demanding production environments.", category: "blender-assets", download: "#"},
  {id: 115, title: "Realistic Touch - Surface Imperfection", image: "Blender/Assets/Realistic Touch - Surface Imperfection.jpg", description: "Comprehensive surface imperfection library for adding photorealistic wear and detail to materials. Includes scratches, fingerprints, dust, dirt, smudges, and wear patterns. Features layerable alpha maps and procedural controls for intensity and placement. All textures are tileable and available in multiple resolutions. Perfect for product visualization, hard surface modeling, and adding realism to any material. Instant photorealism through authentic surface detail.", category: "blender-assets", download: "#"},
  {id: 116, title: "Realtime Aura", image: "Blender/Assets/Realtime Aura.png", description: "Real-time aura and energy effect system optimized for Eevee rendering. Creates glowing auras, energy shields, magical effects, and atmospheric lighting with real-time preview. Features customizable colors, intensity, and animation controls. Includes preset effects for characters, objects, and environmental lighting. Perfect for game assets, real-time visualization, character effects, and magical environments. Optimized performance for interactive applications and real-time rendering.", category: "blender-assets", download: "#"},
  {id: 117, title: "Scene.Blend - Ready To Use Blender Scenes", image: "Blender/Assets/Scene.Blend - Ready To Use Blender Scenes.jpg", description: "Collection of production-ready Blender scenes for immediate use and learning. Includes fully-lit environments, material setups, and optimized render settings. Features diverse scene types: studios, interiors, exteriors, and abstract backgrounds. All scenes are editable and customizable for various projects. Perfect for product rendering, character presentation, motion graphics, and quick project starts. Professional scene setups ready to render.", category: "blender-assets", download: "#"},
  {id: 118, title: "Skyline Ukiyo Modern Metropolis", image: "Blender/Assets/Skyline Ukiyo Modern Metropolis.jpg", description: "Modern cityscape and skyline asset pack with Japanese-inspired urban design. Features skyscrapers, modern architecture, and metropolitan infrastructure with ukiyo-e artistic influence. Includes day and night lighting setups, neon signs, and urban details. All buildings feature detailed textures and optimized geometry. Perfect for urban visualization, cyberpunk environments, modern city scenes, and architectural portfolios. Create stunning modern metropolis landscapes.", category: "blender-assets", download: "#"},
  {id: 119, title: "Stylized Environment Asset Pack - Blender Eevee", image: "Blender/Assets/Stylized Environment asset pack- Blender Eevee.png", description: "Complete stylized environment asset collection optimized for Blender Eevee rendering. Features cartoon-style props, vegetation, rocks, and architectural elements with hand-painted textures. Includes modular building pieces and customizable color schemes. All assets are low-poly with optimized real-time performance. Perfect for game development, animated series, stylized renders, and NPR projects. Create charming stylized worlds with cohesive artistic direction.", category: "blender-assets", download: "#"},
  {id: 120, title: "Universal Human Head Textures", image: "Blender/Assets/Universal Human Head Textures.jpg", description: "Professional human head texture library with universal compatibility for various character models. Features high-resolution skin textures with subsurface scattering maps, pore detail, and micro-surface variation. Includes different skin tones, ages, and ethnic variations. Compatible with standard UV layouts and includes displacement maps. Perfect for character artists, portrait rendering, game characters, and realistic human modeling. Photorealistic human skin textures ready to use.", category: "blender-assets", download: "#"},
  {id: 121, title: "Flared2 - Cinematic Lens Flares In Real-Time", image: "Blender/Assets/Flared2 - Cinematic Lens Flares In Real-Time.png", description: "Advanced real-time lens flare system for creating cinematic optical effects with physical accuracy. Features customizable flare elements, chromatic aberration, and dynamic occlusion. Includes preset flare types: anamorphic, sci-fi, natural, and artistic styles. Optimized for Eevee rendering with real-time preview and animation controls. Perfect for adding realistic camera effects, dramatic lighting, and cinematic atmosphere to scenes. Production-ready lens flares for film and game projects.", category: "blender-assets", download: "#"},
  {id: 122, title: "Horde Add-On Crowd System Tools", image: "Blender/Assets/Horde Add-On Crowd System Tools.png", description: "Professional crowd simulation and character animation system for creating large-scale populated scenes. Features intelligent agent behaviors, pathfinding, and group dynamics with collision avoidance. Includes preset crowd types: pedestrians, soldiers, animals, and custom character groups. Supports motion capture integration and procedural animation blending. Perfect for battle scenes, city crowds, stadium audiences, and large-scale environmental storytelling. Create realistic crowd behaviors with minimal setup.", category: "blender-assets", download: "#"},
  {id: 123, title: "Realmotion Pro", image: "Blender/Assets/Realmotion Pro.png", description: "Advanced real-time motion graphics and animation toolset for dynamic visual effects and procedural animation. Features parametric animation controls, dynamic shape morphing, and automated timing systems. Includes preset motion types: kinetic typography, UI animations, and procedural transitions. Real-time preview with Eevee optimization and export-ready animation sequences. Perfect for motion graphics artists, UI designers, and dynamic VFX creation. Streamline animation workflow with intelligent motion controls.", category: "blender-assets", download: "#"},
  {id: 124, title: "Simply Stitch", image: "Blender/Assets/Simply Stitch.png", description: "Intuitive cloth stitching and sewing simulation tool for creating realistic fabric construction and garment assembly. Features thread-based physics, seam strength controls, and fabric connection systems. Includes preset stitching patterns: straight seams, hems, decorative stitching, and complex garment construction. Real-time simulation with adjustable thread properties and fabric behavior. Perfect for fashion design, costume creation, and realistic fabric assembly visualization. Create authentic sewn garments with detailed stitching effects.", category: "blender-assets", download: "#"},
  {id: 125, title: "Sprite Particles For Realtime Vfx", image: "Blender/Assets/Sprite Particles For Realtime Vfx.png", description: "Optimized sprite-based particle system for creating high-performance visual effects in real-time applications. Features billboarded sprites, animated textures, and GPU-accelerated rendering with Eevee optimization. Includes preset effect types: explosions, smoke, fire, magic effects, and environmental particles. Supports texture atlases and animated sprite sequences for complex particle behaviors. Perfect for game development, real-time VFX, and interactive applications. Create stunning effects with minimal performance impact.", category: "blender-assets", download: "#"},
  {id: 126, title: "Universal Human Collection", image: "Blender/Assets/Universal Human Collection.jpg", description: "Comprehensive human character asset library with diverse body types, ethnicities, and age groups. Features photorealistic anatomy, detailed facial features, and production-ready rigging systems. Includes various clothing options, hairstyles, and accessory elements for complete character customization. All assets feature PBR materials and compatible UV layouts for texture swapping. Perfect for character artists, animation studios, and large-scale production environments. Create diverse human characters with consistent quality standards.", category: "blender-assets", download: "#"},
  {id: 127, title: "Procedural Lightning Effects Generator", image: "Blender/Assets/Procedural Lightning Effects Generator.jpg", description: "Advanced procedural lightning and electrical effects generator for creating stunning electrical discharges and atmospheric effects. Features customizable bolt patterns, branching algorithms, and realistic electrical behavior. Includes preset lightning types: cloud-to-ground, intra-cloud, and ball lightning effects. Perfect for storm scenes, sci-fi environments, magical effects, and dramatic atmospheric visuals. Real-time preview with adjustable intensity and color controls.", category: "blender-assets", download: "#"},
  {id: 128, title: "Tree And Grass Library Botaniq - Trees", image: "Blender/Assets/Tree And Grass Library Botaniq - Trees.jpg", description: "Comprehensive botanical library featuring high-quality tree and grass assets with photorealistic detail. Includes diverse tree species, seasonal variations, and detailed grass systems. Features optimized geometry for both close-up and distant rendering. All assets include PBR materials with realistic bark, leaf, and grass textures. Perfect for environment design, architectural visualization, and natural landscape creation. Professional-grade botanical assets for production use.", category: "blender-assets", download: "#"}
];

// Membership
const membershipProducts = [
  {id: 103, title: "Adobe Creative Cloud All Apps", image: "Membership/Image/adobe creative cloud.jpg", category: "Design / Creative", description: "Complete Adobe suite - Photoshop, Premiere, After Effects & more", price: "$10", onSale: false, download: "Membership/adobe-creative-cloud.html", type: "membership"},
  {id: 104, title: "ChatGPT-5 Plus – Private Access", image: "Membership/Image/ChatGPT-5 Plus – Private Access.png", category: "AI / Technology", description: "Advanced AI access with GPT-5 capabilities for private use", price: "$15", onSale: false, download: "Membership/chatgpt-5-plus.html", type: "membership"},
  {id: 106, title: "Runway Unlimited - AI Video Tools", image: "Membership/Image/runway.png", category: "AI / Video", description: "Unlimited AI video generation, editing & creative tools", price: "$12", onSale: false, download: "Membership/runway-unlimited.html", type: "membership"},
  {id: 107, title: "CHATGLM Tool – Next-Level AI Creativity", image: "Membership/Image/CHATGLM.png", category: "AI / Technology", description: "Unlimited Image & Video Generation | 4K Ultra HD | 60 FPS | No Watermark", price: "$18", onSale: false, download: "Membership/chatglm.html", type: "membership"},
  {id: 108, title: "Autodesk Collection - All Products Access", image: "Membership/Image/autodesk.jpg", category: "Design / Engineering", description: "Full access to all Autodesk products including AutoCAD, Maya, 3ds Max, Revit & more", price: "$55", onSale: false, download: "Membership/autodesk-collection.html", type: "membership"}
];
