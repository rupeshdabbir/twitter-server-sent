function comparator(a,b) {
    return b && b.created_at - a && a.created_at;
}

export default comparator;
