const ImageSize = {};

ImageSize.LARGE = 'large';
ImageSize.SMALL = 'small';
ImageSize.ORIGINAL = 'original';
ImageSize.MEDIUM = 'medium';
ImageSize.THUMBNAIL = 'thumb';
ImageSize.AVATAR = 'avatar';

Object.freeze(ImageSize);
export default ImageSize;


// REFERENCE FOR DIMENSIONS
// [{
//     "size": "large",
//     "width": 1000,
//     "height": 750
// }, {
//     "size": "small",
//         "width": 320,
//         "height": 240
// }, {
//     "size": "original",
//         "width": 0,
//         "height": 0
// }, {
//     "size": "medium",
//         "width": 640,
//         "height": 482
// }, {
//     "size": "thumb",
//         "width": 200,
//         "height": 150
// }, {
//     "size": "avatar",
//         "width": 100,
//         "height": 75
// }]
