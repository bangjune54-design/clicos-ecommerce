import { Project, SyntaxKind } from 'ts-morph';
import google from 'googlethis';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getImageForProduct(productName, brandName) {
  try {
    let cleanBrand = brandName;
    if (brandName.toLowerCase().includes('4pm')) cleanBrand = '4PM';
    else if (brandName.toLowerCase().includes('ddalmomde')) cleanBrand = 'ddalmomde';
    else if (brandName.toLowerCase().includes('Joseon')) cleanBrand = 'Beauty of Joseon';
    
    // Add "skincare" to help google find right product
    const query = `${cleanBrand} ${productName} transparent png`;
    console.log(`Searching: ${query}`);
    
    const options = {
      page: 0, 
      safe: false, 
      additional_params: { hl: 'en' }
    };
    
    const images = await google.image(query, options);
    
    if (images && images.length > 0) {
      // Return the first image URL that looks like a valid image and not too generic
      for (const img of images) {
        if (img.url && img.url.toLowerCase().includes('.png') && !img.url.toLowerCase().includes('.jpg') && !img.url.includes('lookfantastic') && !img.url.includes('sephora')) {
          return img.url;
        }
      }
      return null;
    }
  } catch (err) {
    console.error(`Error searching image for ${productName}:`, err.message);
  }
  return null;
}

async function run() {
  const project = new Project();
  project.addSourceFilesAtPaths('src/data/*Products.ts');
  const files = project.getSourceFiles('src/data/*Products.ts');
  
  let totalUpdated = 0;
  
  for (const file of files) {
    const fileName = file.getBaseName();
    if (fileName === 'aesturaProducts.ts' || fileName === '4pmProducts.ts') {
      console.log(`\n--- Skipping ${fileName} as per user instruction ---`);
      continue;
    }

    let brandName = fileName.replace('Products.ts', '');
    brandName = brandName.replace(/([A-Z])/g, ' $1').trim(); // camelCase to title
    brandName = brandName.charAt(0).toUpperCase() + brandName.slice(1);

    console.log(`\n--- Processing ${fileName} (Brand: ${brandName}) ---`);

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
              const currentImageSrc = imageSrcProp.getInitializer().getText().replace(/['"]/g, '');
              
              // Force update to get transparent background versions
              const newUrl = await getImageForProduct(nameValue, brandName);
              if (newUrl) {
                imageSrcProp.setInitializer(`"${newUrl}"`);
                console.log(`[UPDATED] ${nameValue}`);
                totalUpdated++;
              } else {
                console.log(`[SKIPPED] No transparent PNG found for ${nameValue}`);
              }
              
              // Add tiny delay to not bombard google
              await delay(800);
            }
          }
        }
      }
    }
    
    file.saveSync();
    console.log(`Saved ${fileName}`);
  }
  
  console.log(`\nFinished! Total products updated: ${totalUpdated}`);
}

run().catch(console.error);
