// Fullscreen projection: position is already in NDC [-1, 1].
// No model/view/projection needed — the plane always fills the screen.

varying vec2 v_objectUV;

void main() {
  // Map NDC [-1,1] → UV [-0.5, 0.5] (centered at 0) to match the original shader
    v_objectUV = position.xy * 0.5;
    gl_Position = vec4(position.xy, 1.0, 1.0);
}
