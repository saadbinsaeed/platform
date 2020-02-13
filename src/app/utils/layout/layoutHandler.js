/**
 * Class to handle automatic layouts
 */
class LayoutHandler {
    /**
     * Constructor
     */
    constructor() {
        this.components = {};
    }

    /**
     * Add an element to this LayoutHandler
     * @param name the name of the element
     * @param element the dom node of the element
     */
    register(name, element) {
        this.components[name] = element;
    }

    /**
     * Resize the registered header, page header and content.
     */
    setHeights() {
        const { App, AppHeader, pageHeader, pageContent } = this.components;
        if (App && AppHeader && pageHeader && pageContent) {
            //const AppSize = App.offsetHeight;
            const AppHeaderSize = AppHeader.offsetHeight;
            const pageHeaderSize = pageHeader.offsetHeight;
            pageHeader.style.top = `${AppHeaderSize}px`;
            pageContent.style.paddingTop = `${pageHeaderSize}px`;
            //pageContent.style.minHeight = `${AppSize - AppHeaderSize - pageHeaderSize}px`;
        }
    }

    /**
     * Set the heights for the layout component
     */
    setLayoutHeight() {
        const { App, Layout, extraHeight } = this.components;
        if (App && extraHeight) {
            Layout.style.height = `${'100'}vh`;
        }
    }

    /**
     * Dynamically set the height of our grid component
     */
    setDataGridHeight() {
        const { Grid, GridContainer } = this.components;
        if (Grid && GridContainer) {
            const GridContainerSize = GridContainer.offsetHeight;
            Grid.style.height = `${GridContainerSize.height}px`;
        }
    }
}
export const layoutHandler = new LayoutHandler();

