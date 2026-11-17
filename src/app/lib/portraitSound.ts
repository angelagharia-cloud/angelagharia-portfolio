export function playSway(context: AudioContext, from: number, to: number) {
  const duration = 0.48
  const noise = context.createBuffer(1, Math.ceil(context.sampleRate * duration), context.sampleRate)
  const samples = noise.getChannelData(0)
  for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1

  const source = context.createBufferSource()
  source.buffer = noise
  const filter = context.createBiquadFilter()
  filter.type = "bandpass"
  filter.Q.value = 0.7
  const volume = context.createGain()
  const pan = context.createStereoPanner()
  const t = context.currentTime
  filter.frequency.setValueAtTime(600, t)
  filter.frequency.exponentialRampToValueAtTime(2000, t + 0.22)
  filter.frequency.exponentialRampToValueAtTime(700, t + duration)
  volume.gain.setValueAtTime(0.0001, t)
  volume.gain.exponentialRampToValueAtTime(0.17, t + 0.2)
  volume.gain.exponentialRampToValueAtTime(0.0001, t + duration)
  pan.pan.setValueAtTime(from * 0.6, t)
  pan.pan.linearRampToValueAtTime(to * 0.6, t + duration)
  source.connect(filter).connect(volume).connect(pan).connect(context.destination)
  source.onended = () => { source.disconnect(); filter.disconnect(); volume.disconnect(); pan.disconnect() }
  source.start()
}
