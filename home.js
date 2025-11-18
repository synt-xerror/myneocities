import { update } from './global.js';

// -------------
//    DONUT
// -------------


let config = {
  velX: 0.06,
  velZ: 0.02,
  raioGrande: 2.5,
  raioPequeno: 1.2,
  luzX: 0.0,
  luzY: -1.0,
  luzZ: -1.0,
  chars: ".,-~:;=!*#$@",
  qualidade: 2,
};

let anguloA = 0;
let anguloB = 0;
let animando = true;

const LARGURA = 80;
const ALTURA = 34;
const canvas = document.getElementById("donutCanvas");

function renderDonut() {
  const buffer = Array(ALTURA)
    .fill()
    .map(() => Array(LARGURA).fill(" "));
  const zBuffer = Array(ALTURA)
    .fill()
    .map(() => Array(LARGURA).fill(0));

  const sinA = Math.sin(anguloA);
  const cosA = Math.cos(anguloA);
  const sinB = Math.sin(anguloB);
  const cosB = Math.cos(anguloB);

  const luzLen =
    Math.sqrt(config.luzX ** 2 + config.luzY ** 2 + config.luzZ ** 2) || 1;
  const luzNormX = config.luzX / luzLen;
  const luzNormY = config.luzY / luzLen;
  const luzNormZ = config.luzZ / luzLen;

  const thetaStep = [0.15, 0.09, 0.05][config.qualidade - 1];
  const phiStep = [0.06, 0.03, 0.02][config.qualidade - 1];

  for (let theta = 0; theta < 6.28; theta += thetaStep) {
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);

    for (let phi = 0; phi < 6.28; phi += phiStep) {
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      const circX = config.raioGrande + config.raioPequeno * cosTheta;
      const circY = config.raioPequeno * sinTheta;

      let x = circX * cosPhi;
      let y = circY;
      let z = circX * sinPhi;

      // Rotação X
      const xTemp = x;
      x = x * cosA - y * sinA;
      y = xTemp * sinA + y * cosA;

      // Rotação Z
      const xTemp2 = x;
      x = x * cosB - z * sinB;
      z = xTemp2 * sinB + z * cosB;

      const profZ = z + 5;
      const invZ = 1 / profZ;

      const telaX = Math.floor(LARGURA / 2 + 30 * x * invZ);
      const telaY = Math.floor(ALTURA / 2 - 15 * y * invZ);

      let normX = cosTheta * cosPhi;
      let normY = sinTheta;
      let normZ = cosTheta * sinPhi;

      // Rotaciona normal
      const nxTemp = normX;
      normX = normX * cosA - normY * sinA;
      normY = nxTemp * sinA + normY * cosA;

      const nxTemp2 = normX;
      normX = normX * cosB - normZ * sinB;
      normZ = nxTemp2 * sinB + normZ * cosB;

      const luminosidade =
        normX * luzNormX + normY * luzNormY + normZ * luzNormZ;

      if (telaX >= 0 && telaX < LARGURA && telaY >= 0 && telaY < ALTURA) {
        if (invZ > zBuffer[telaY][telaX]) {
          zBuffer[telaY][telaX] = invZ;

          const indice = Math.floor(
            ((luminosidade + 1) * (config.chars.length - 1)) / 2
          );
          const idx = Math.max(0, Math.min(config.chars.length - 1, indice));
          buffer[telaY][telaX] = config.chars[idx];
        }
      }
    }
  }

  canvas.textContent = buffer.map((row) => row.join("")).join("\n");
}

function animar() {
  if (animando) {
    renderDonut();
    anguloA += config.velX;
    anguloB += config.velZ;
  }
  requestAnimationFrame(animar);
}
animar();

const track = document.querySelector(".track");
track.innerHTML += track.innerHTML;

// -------------
//  latest blog
// -------------

update("home"); // type = "home"