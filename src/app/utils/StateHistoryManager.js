// WARNING: flow here brakes :(

/**
 * Defines the routes for the Broadcasts views
 */
export default class StateHistoryManager {

    dataPast = [];
    dataFuture = [];
    currentState = {};
    canUndo = false;
    canRedo = false;

    /**
     *  Constructor of StateHistoryManager
     */
    constructor(currentState) {
        this.currentState = currentState;
    }

    push = (currentState) => {
        if (currentState !== this.currentState) {
            this.dataPast = [ this.currentState, ...this.dataPast ];
            this.canUndo = this.dataPast.length > 0;
            this.canRedo = this.dataFuture.length > 0;
            this.currentState = currentState || {};
        }
    }

    /**
     *
     */
    undo = (currentState) => {
        const [ previous, ...dataPast ] = this.dataPast;
        this.dataPast = dataPast;
        this.dataFuture = [currentState, ...this.dataFuture];
        this.canUndo = this.dataPast.length > 0;
        this.canRedo = this.dataFuture.length > 0;
        this.currentState = previous;
        return previous;
    }

    /**
     *
     */
     redo = (currentState) => {
         this.dataPast = [ currentState, ...this.dataPast];
         const [ next, ...dataFuture ] = this.dataFuture;
         this.dataFuture = dataFuture;
         this.canUndo = this.dataPast.length > 0;
         this.canRedo = this.dataFuture.length > 0;
         this.currentState = next;
         return next;
     }
}
