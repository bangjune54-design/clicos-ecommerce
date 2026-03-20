import { Project, SyntaxKind } from 'ts-morph';
import google from 'googlethis';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getImageForProduct(productName) {
  try {
    // Try US site first
    let query = `medicube ${productName} official`;
    let options = { page: 0, safe: false, additional_params: { hl: 'en' } };
    
    let images = await google.image(query, options);
    if (images && images.length > 0) {
      for (const img of images) {
        if (img.url && (img.url.includes('medicube') || img.url.includes('themedicube'))) {
          return img.url;
        }
      }
    }

    // Try KR site
    query = `medicube korea ${productName}`;
    images = await google.image(query, options);
    if (images && images.length > 0) {
      for (const img of images) {
        if (img.url && (img.url.includes('medicube') || img.url.includes('themedicube'))) {
          return img.url;
        }
      }
    }
  } catch (err) {
    console.error(`Error searching image for ${productName}:`, err.message);
  }
  return null;
}

async function run() {
  const project = new Project();
  project.addSourceFilesAtPaths('src/data/medicubeProducts.ts');
  const file = project.getSourceFile('src/data/medicubeProducts.ts');
  
  if (!file) {
    console.error("Could not find src/data/medicubeProducts.ts");
    return;
  }

  let totalUpdated = 0;
  
  console.log(`\n--- Processing medicubeProducts.ts ---`);

  const arrayDeclarations = file.getVariableDeclarations();
  for (const decl of arrayDeclarations) {
    const initializer = decl.getInitializerIfKind(SyntaxKind.ArrayLiteralExpression);
    if (initializer) {
      const elements = initializer.getElements();
      for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.getKind() === SyntaxKind.ObjectLiteralExpression) {
          const nameProp = element.getProperty('name');
          const imageSrcProp = element.getProperty('imageSrc');
          
          if (nameProp && imageSrcProp) {
            const nameValue = nameProp.getInitializer().getText().replace(/['"]/g, '');
            const currentImageUrl = imageSrcProp.getInitializer().getText().replace(/['"]/g, '');
            
            // Skip if it's already from medicube domain to save time
            if (currentImageUrl.includes('medicube.us') || currentImageUrl.includes('themedicube.co.kr')) {
               console.log(`[SKIPPED] Already correct domain: ${nameValue}`);
               continue;
            }

            const newUrl = await getImageForProduct(nameValue);
            if (newUrl) {
              imageSrcProp.setInitializer(`"${newUrl}"`);
              console.log(`[UPDATED] ${nameValue} -> ${newUrl}`);
              totalUpdated++;
            } else {
              console.log(`[NOT FOUND] No image from medicube sites for ${nameValue}`);
            }
            
            await delay(500);
          }
        }
      }
    }
  }
  
  file.saveSync();
  console.log(`\nSaved medicubeProducts.ts. Total updated: ${totalUpdated}`);
}

run().catch(console.error);
