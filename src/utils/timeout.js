/**
 * Util for clearing setTimeout.
 */

function clearAllTimeout(allTimeout, clearTimeout) {
    allTimeout.forEach(each => clearTimeout(each));
    allTimeout = [];
}