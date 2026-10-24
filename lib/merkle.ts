import crypto from 'crypto';

export interface MerkleNode {
  hash: string;
  left?: MerkleNode;
  right?: MerkleNode;
}

export interface MerkleProofStep {
  position: 'left' | 'right';
  hash: string;
}

export interface MerkleProof {
  leafHash: string;
  root: string;
  proof: MerkleProofStep[];
  verified: boolean;
}

/**
 * Computes SHA-256 of any string input
 */
export function sha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Combines two hash strings into a parent hash
 */
export function combineHashes(left: string, right: string): string {
  return sha256(left + right);
}

/**
 * Builds a Merkle Tree from an array of hex hashes.
 * If odd number of hashes, duplicates the last hash.
 */
export function buildMerkleTree(hashes: string[]): { root: string; layers: string[][] } {
  if (hashes.length === 0) {
    const emptyRoot = sha256('TRUTHPULSE_EMPTY_BLOCK');
    return { root: emptyRoot, layers: [[emptyRoot]] };
  }

  const layers: string[][] = [hashes];

  let currentLayer = hashes;
  while (currentLayer.length > 1) {
    const nextLayer: string[] = [];
    for (let i = 0; i < currentLayer.length; i += 2) {
      const left = currentLayer[i];
      const right = i + 1 < currentLayer.length ? currentLayer[i + 1] : left; // duplicate if odd
      nextLayer.push(combineHashes(left, right));
    }
    layers.push(nextLayer);
    currentLayer = nextLayer;
  }

  return {
    root: currentLayer[0],
    layers
  };
}

/**
 * Generates an audit proof for a specific leaf hash in the tree
 */
export function generateMerkleProof(leafHash: string, allHashes: string[]): MerkleProof {
  const index = allHashes.indexOf(leafHash);
  if (index === -1) {
    const { root } = buildMerkleTree(allHashes);
    return {
      leafHash,
      root,
      proof: [],
      verified: false
    };
  }

  const { root, layers } = buildMerkleTree(allHashes);
  const proof: MerkleProofStep[] = [];
  let currentIndex = index;

  for (let layerIndex = 0; layerIndex < layers.length - 1; layerIndex++) {
    const currentLayer = layers[layerIndex];
    const isRightNode = currentIndex % 2 === 1;
    const siblingIndex = isRightNode ? currentIndex - 1 : currentIndex + 1;

    if (siblingIndex < currentLayer.length) {
      proof.push({
        position: isRightNode ? 'left' : 'right',
        hash: currentLayer[siblingIndex]
      });
    } else {
      // Duplicated self
      proof.push({
        position: 'right',
        hash: currentLayer[currentIndex]
      });
    }

    currentIndex = Math.floor(currentIndex / 2);
  }

  const verified = verifyMerkleProof(leafHash, proof, root);

  return {
    leafHash,
    root,
    proof,
    verified
  };
}

/**
 * Verifies a Merkle audit path mathematically against the root hash
 */
export function verifyMerkleProof(leafHash: string, proof: MerkleProofStep[], root: string): boolean {
  let computedHash = leafHash;

  for (const step of proof) {
    if (step.position === 'left') {
      computedHash = combineHashes(step.hash, computedHash);
    } else {
      computedHash = combineHashes(computedHash, step.hash);
    }
  }

  return computedHash.toLowerCase() === root.toLowerCase();
}
