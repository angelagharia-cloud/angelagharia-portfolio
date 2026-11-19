import landingAtlas from "../../imports/opt/process-landing.webp"
import { useEffect, useRef } from "react"
import film from "../../assets/cotton-flight.mp4"
import tracking from "../../assets/cotton-flight.json"

const vertex = `
attribute vec2 uv;
uniform vec2 viewport, origin, head, start, shift;
uniform float scale;
varying vec2 tex;
void main() {
  tex = uv;
  vec2 p = uv * vec2(480.,270.) - start;
  vec2 axis = head - start;
  float reach = length(axis);
  float axisPosition = dot(p,axis)/max(reach,1.);
  // Leave both the anchored end and the photographed bobbin locally rigid.
  float blend = smoothstep(0.,max(1.,reach - 32.),axisPosition);
  float rigid = 1. - smoothstep(44.,60.,distance(uv*vec2(480.,270.),head));
  blend = max(blend,rigid);
  vec2 screen = origin + scale * p + shift * blend;
  // Retain a gravity belly when the take is registered to a shallower layout.
  float slack = sin(3.14159265*blend);
  screen.y += min(26.,.085*length(scale*axis+shift))*slack*slack;
  gl_Position = vec4(screen / viewport * vec2(2.,-2.) + vec2(-1.,1.),0.,1.);
}`
const fragment = `
precision highp float;
uniform sampler2D plate;
uniform vec2 head;
varying vec2 tex;
void main(){
  vec3 rgb = texture2D(plate,tex).rgb;
  // The generated stand shares the key colour. Only cotton and cardboard
  // have warm red-channel detail; recover their light from the blue mix.
  float warmth = (rgb.r - rgb.b) / max(rgb.b,.01);
  float a = smoothstep(-.59,-.02,warmth);
  if (tex.x * 480. > head.x + 40. || a < .025) discard;
  vec3 clean = clamp((rgb - (1.-a)*vec3(.075,.24,.80))/max(a,.025),0.,1.);
  clean.b = min(clean.b,clean.g);
  float strand = smoothstep(34.,40.,distance(tex*vec2(480.,270.),head));
  float fibreLight = dot(clean,vec3(.30,.59,.11));
  vec3 cotton = mix(vec3(.34,.26,.19),vec3(.76,.66,.52),fibreLight);
  clean = mix(clean,cotton,strand);
  a = mix(a,sqrt(a),strand);
  gl_FragColor = vec4(clean * a,a);
}`

export function CottonFilm({
  onFallback,
  onArrival,
}: {
  onFallback: () => void
  onArrival: () => void
}) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!
    const anchor = canvas.closest<HTMLElement>(".spool-origin")!
    const word = anchor.parentElement!
    const jacket = document.querySelector<HTMLElement>("#portrait-stage img")!
    const process = document.querySelector<HTMLElement>(".process-canvas")!
    const video = document.createElement("video")
    const landingPreload = new Image()
    landingPreload.src = landingAtlas
    video.muted = true
    video.playsInline = true
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
    })
    if (!gl) {
      onFallback()
      return
    }
    const shaders: WebGLShader[] = []
    const program = gl.createProgram()!
    for (const [kind, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(kind)!
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      gl.attachShader(program, shader)
      shaders.push(shader)
    }
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      shaders.forEach((s) => gl.deleteShader(s))
      gl.deleteProgram(program)
      onFallback()
      return
    }
    gl.useProgram(program)
    const grid: number[] = []
    for (let y = 0; y < 32; y++)
      for (let x = 0; x < 64; x++) {
        for (const [dx, dy] of [
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 0],
          [1, 1],
          [0, 1],
        ])
          grid.push((x + dx) / 64, (y + dy) / 32)
      }
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(grid), gl.STATIC_DRAW)
    const uv = gl.getAttribLocation(program, "uv")
    gl.enableVertexAttribArray(uv)
    gl.vertexAttribPointer(uv, 2, gl.FLOAT, false, 0, 0)
    const texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    for (const setting of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER])
      gl.texParameteri(gl.TEXTURE_2D, setting, gl.LINEAR)
    for (const setting of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T])
      gl.texParameteri(gl.TEXTURE_2D, setting, gl.CLAMP_TO_EDGE)
    const uniform = Object.fromEntries(
      ["viewport", "origin", "head", "start", "shift", "scale"].map((k) => [
        k,
        gl.getUniformLocation(program, k),
      ]),
    )
    const start = tracking.points[0],
      hit = tracking.points[tracking.contact],
      last = tracking.points[tracking.points.length - 1]
    let raf = 0,
      disposed = false,
      following = true,
      finished = false
    const stopFollowing = () => {
      following = false
    }
    const events = ["wheel", "touchstart", "keydown"] as const
    events.forEach((e) =>
      window.addEventListener(e, stopFollowing, { passive: true }),
    )
    let impacted = false
    const initialScroll = scrollY
    function draw() {
      if (disposed || finished) return
      const ctx = gl!
      const w = innerWidth,
        h = innerHeight,
        dpr = Math.min(devicePixelRatio, 1.5)
      if (
        canvas.width !== Math.round(w * dpr) ||
        canvas.height !== Math.round(h * dpr)
      ) {
        canvas.width = Math.round(w * dpr)
        canvas.height = Math.round(h * dpr)
        ctx.viewport(0, 0, canvas.width, canvas.height)
      }
      const frame = Math.min(tracking.points.length - 1, video.currentTime * 24)
      const index = Math.floor(frame),
        mix = frame - index
      const a = tracking.points[index],
        b = tracking.points[Math.min(index + 1, tracking.points.length - 1)]
      const x = a[0] + (b[0] - a[0]) * mix,
        y = a[1] + (b[1] - a[1]) * mix
      const o = anchor.getBoundingClientRect(),
        p = jacket.getBoundingClientRect(),
        e = process.querySelector(".landing-entry")!.getBoundingClientRect()
      const width =
        anchor.querySelector<HTMLElement>(".flight-spool")!.offsetWidth
      const startScale = (width * 0.83) / start[2]
      const arrivalWidth =
        (process.querySelector<HTMLElement>(".cotton-landing")!.offsetWidth *
          75) /
        384
      const travel = Math.max(
        0,
        (frame - tracking.contact) /
          (tracking.points.length - 1 - tracking.contact),
      )
      const scale =
        startScale + (arrivalWidth / last[2] - startScale) * travel * travel
      const cx = p.left + p.width * 0.24 - width * 0.38 - o.left,
        cy = p.top + p.height * 0.21 - o.top
      let dx: number, dy: number
      if (frame <= tracking.contact) {
        const t = Math.min(1, Math.max(0, (x - start[0]) / (hit[0] - start[0])))
        dx = t * cx
        // Carry the rim with the rotating letter until release, then settle
        // into the tracked approach without moving the shoulder contact.
        const pivotDistance = o.left - word.getBoundingClientRect().left
        const slopeDrop =
          pivotDistance * Math.sin(Math.PI / 45) * Math.min(1, frame / 11)
        dy =
          t * cy +
          scale * (y - start[1] - t * (hit[1] - start[1])) +
          slopeDrop * (1 - t) ** 2
      } else {
        const t =
          (frame - tracking.contact) /
          (tracking.points.length - 1 - tracking.contact)
        const s = t * t
        dx =
          cx +
          (e.left - o.left - cx) * s +
          scale * (x - hit[0] - s * (last[0] - hit[0]))
        dy =
          cy +
          (e.top - o.top - cy) * s +
          scale * (y - hit[1] - s * (last[1] - hit[1]))
      }
      if (!impacted && frame >= tracking.contact) {
        impacted = true
        jacket.animate(
          [
            { rotate: "0deg" },
            { rotate: ".28deg", offset: 0.24 },
            { rotate: "-.06deg", offset: 0.68 },
            { rotate: "0deg" },
          ],
          { duration: 330 },
        )
      }
      const tilt =
        Math.min(1, frame / 11) * Math.max(0, Math.min(1, (27 - frame) / 11))
      word.style.setProperty("--surname-tilt", String(4 * tilt) + "deg")
      if (following)
        window.scrollTo({
          top: Math.max(initialScroll, scrollY + o.top + dy - h * 0.6),
          behavior: "instant",
        })
      const pos = anchor.getBoundingClientRect()
      ctx.uniform2f(uniform.viewport, w, h)
      ctx.uniform2f(uniform.origin, pos.left, pos.top)
      ctx.uniform2f(uniform.head, x, y)
      ctx.uniform2f(uniform.start, start[0], start[1])
      ctx.uniform1f(uniform.scale, scale)
      ctx.uniform2f(
        uniform.shift,
        dx - scale * (x - start[0]),
        dy - scale * (y - start[1]),
      )
      ctx.texImage2D(
        ctx.TEXTURE_2D,
        0,
        ctx.RGB,
        ctx.RGB,
        ctx.UNSIGNED_BYTE,
        video,
      )
      ctx.clear(ctx.COLOR_BUFFER_BIT)
      ctx.drawArrays(ctx.TRIANGLES, 0, grid.length / 2)
      anchor.classList.add("film-playing")
      if (frame >= tracking.points.length - 1) {
        finished = true
        video.pause()
        anchor.classList.add("flight-landed")
        canvas.hidden = true
        onArrival()
        return
      }
      raf = requestAnimationFrame(draw)
    }
    const fail = () => {
      if (!disposed) onFallback()
    }
    canvas.addEventListener("webglcontextlost", fail)
    video.onerror = fail
    video.src = film
    video
      .play()
      .then(() => {
        if (!disposed) draw()
      })
      .catch(fail)
    return () => {
      canvas.removeEventListener("webglcontextlost", fail)
      disposed = true
      cancelAnimationFrame(raf)
      video.onerror = null
      video.pause()
      video.removeAttribute("src")
      video.load()
      events.forEach((e) => window.removeEventListener(e, stopFollowing))
      word.style.removeProperty("--surname-tilt")
      anchor.classList.remove("film-playing", "flight-landed")
      releaseResources()
    }
    function releaseResources() {
      gl!.deleteTexture(texture)
      gl!.deleteBuffer(buffer)
      gl!.deleteProgram(program)
      shaders.forEach((s) => gl!.deleteShader(s))
    }
  }, [onFallback, onArrival])
  return <canvas ref={ref} aria-hidden="true" className="cotton-film" />
}
