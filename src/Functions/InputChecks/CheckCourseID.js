// Return whether the given course is valid to submit to database
// Returns [bool, "error text"]
export const CheckCourseID = (courseID) => {
    const maxCharLength = 10

    const r = /^[a-z0-9 ()]+$/i

    // Return true (valid) if number of chars is less or equal to the limit
    // And is only alphanumeric (letters + numbers) and "()" or "[]"
    if (courseID.length <= maxCharLength) {
        const match = r.exec(courseID)
    
        if (match && match[0] === courseID) {
            return [true, ""]
        }
        else {
            return [false, "Course ID can only contain letters, numbers, (), and spaces"]
        }
    }
    else {
        return [false, "Course ID must be max of " + String(maxCharLength) + " chars"]
    }
};
