// scraper/siteScraper.js
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const { URL } = require('url');

class SiteScraper {
  async cloneSite(targetUrl) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
      await page.goto(targetUrl, { waitUntil: 'networkidle2' });

      // Capturer le HTML complet
      const content = await page.content();
      const $ = cheerio.load(content);

      // Extraire les styles (peut être vide à cause des restrictions cross-origin)
      const styles = await page.evaluate(() => {
        return Array.from(document.styleSheets)
          .map((sheet) => {
            try {
              return Array.from(sheet.cssRules)
                .map((rule) => rule.cssText)
                .join('\n');
            } catch (e) {
              return '';
            }
          })
          .join('\n');
      });

      // Analyser la structure
      const structure = this.analyzeStructure($);

      // Télécharger les assets (stub pour l’instant)
      const assets = await this.downloadAssets(page, targetUrl);

      await browser.close();

      return {
        html: content,
        styles,
        structure,
        assets,
      };
    } catch (error) {
      await browser.close();
      throw error;
    }
  }

  analyzeStructure($) {
    const sections = [];

    // Détecter automatiquement les sections principales
    const possibleSections = ['header', 'nav', 'main', 'section', 'footer'];

    possibleSections.forEach((tag) => {
      $(tag).each((i, elem) => {
        sections.push({
          type: tag,
          classes: $(elem).attr('class') || '',
          id: $(elem).attr('id') || '',
          content: this.extractContent($, $(elem)),
        });
      });
    });

    return sections;
  }

  extractContent($, $elem) {
    // Convertir le contenu HTML en blocs éditables
    return {
      text: $elem
        .find('h1, h2, h3, h4, h5, h6, p')
        .map((i, el) => ({
          tag: el.tagName,
          content: $(el).text(),
          styles: $(el).attr('style') || '',
        }))
        .get(),
      images: $elem
        .find('img')
        .map((i, el) => ({
          src: $(el).attr('src'),
          alt: $(el).attr('alt') || '',
        }))
        .get(),
      links: $elem
        .find('a')
        .map((i, el) => ({
          href: $(el).attr('href'),
          text: $(el).text(),
        }))
        .get(),
    };
  }

  async downloadAssets(page, targetUrl) {
    // Stub: on ne télécharge rien pour l’instant
    // Plus tard: on pourra récupérer images/css/fonts et les sauver dans un dossier output/
    return [];
  }
}

module.exports = SiteScraper;
      return {
        html: content,
        styles,
        structure,
        assets
      };
      
    } catch (error) {
      await browser.close();
      throw error;
    }
  }
  
  analyzeStructure($) {
    const sections = [];
    
    // Détecter automatiquement les sections principales
    const possibleSections = ['header', 'nav', 'main', 'section', 'footer'];
    
    possibleSections.forEach(tag => {
      $(tag).each((i, elem) => {
        sections.push({
          type: tag,
          classes: $(elem).attr('class') || '',
          id: $(elem).attr('id') || '',
          content: this.extractContent($(elem))
        });
      });
    });
    
    return sections;
  }
  
  extractContent($elem) {
    // Convertir le contenu HTML en blocs éditables
    return {
      text: $elem.find('h1, h2, h3, h4, h5, h6, p').map((i, el) => ({
        tag: el.tagName,
        content: $(el).text(),
        styles: $(el).attr('style') || ''
      })).get(),
      images: $elem.find('img').map((i, el) => ({
        src: $(el).attr('src'),
        alt: $(el).attr('alt') || ''
      })).get(),
      links: $elem.find('a').map((i, el) => ({
        href: $(el).attr('href'),
        text: $(el).text()
      })).get()
    };
  }
}
module.exports = SiteScraper;
