// Maps product IDs to GLB model IDs
export const GLB_PRODUCT_MAP = {
  '5': 'adas',        // Layout-3D ADAS Calibrazione
  '4': 'simulazione', // Layout 3D Banco Rulli
  '6': 'sigle',       // Layout 2003 Modanature
  '7': 'calibri',     // Disegno Complessivo 1
  '8': 'montaggio',   // Disegno Complessivo 2
  '3': 'maschera',    // IMM-13 Fixture + Robot
  '2': 'sospensioni', // IMM-11 Impianto Assembly
  '1': 'avvitatura',  // IMM-7 Cella Assembly
};

// Reverse mapping: product ID -> GLB model ID
export const getGLBModelIdForProduct = (productId) => {
  // Find the GLB ID that maps to this product
  for (const [glbId, prodId] of Object.entries(GLB_PRODUCT_MAP)) {
    if (prodId === productId) {
      return glbId;
    }
  }
  return null;
};
