function logErrors (err) {
    if (err) {
        console.log(err.message);
    }
}

export default function log (stream) {
    return object => {
        const content = JSON.stringify(object) + "\n";
        stream.write(content, "utf8", logErrors);
    };
}
