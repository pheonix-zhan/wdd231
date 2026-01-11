const courses = [
    { code: "WDD130", name: "Web Fundamentals", credits: 3, completed: true },
    { code: "WDD231", name: "Frontend Development I", credits: 3, completed: false },
    { code: "CSE110", name: "Programming Basics", credits: 2, completed: true },
    { code: "CSE121", name: "JavaScript Language", credits: 3, completed: false }
];

const container = document.getElementById("courses");
const creditOutput = document.getElementById("credits");
const buttons = document.querySelectorAll(".filters button");

function displayCourses(list) {
    container.innerHTML = "";

    list.forEach(course => {
        const div = document.createElement("div");
        div.classList.add("course");
        if (course.completed) div.classList.add("completed");

        div.textContent = `${course.code} - ${course.name} (${course.credits} credits)`;
        container.appendChild(div);
    });

    const totalCredits = list.reduce((sum, course) => sum + course.credits, 0);
    creditOutput.textContent = `Total Credits: ${totalCredits}`;
}

buttons.forEach(button => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;

        if (filter === "all") {
            displayCourses(courses);
        } else {
            displayCourses(
                courses.filter(course =>
                    course.code.toLowerCase().startsWith(filter)
                )
            );
        }
    });
});

displayCourses(courses);
