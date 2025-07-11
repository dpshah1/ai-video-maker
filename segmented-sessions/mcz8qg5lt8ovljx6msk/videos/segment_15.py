from manim import *

class StableMatchingAnimation(Scene):
    def construct(self):
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        timeline = Line(start=LEFT * 3, end=RIGHT * 3).set_color(WHITE)
        self.play(Create(timeline))

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        
        hospitals = VGroup(*[Square(side_length=1).shift(LEFT * 2 + UP * i) for i in range(3)])
        hospital_labels = VGroup(*[Text(f"Hospital {i+1}").scale(0.4).move_to(hospitals[i].get_center()) for i in range(3)])
        self.play(Create(hospitals), Write(hospital_labels))
        
        students = VGroup(*[Circle(radius=0.25).shift(RIGHT * 2 + UP * i) for i in range(3)])
        student_labels = VGroup(*[Text(f"Student {i+1}").scale(0.4).move_to(students[i].get_center()) for i in range(3)])
        self.play(Create(students), Write(student_labels))
        
        self.wait(1)

        for i in range(3):
            circle = Circle(radius=0.5)
            self.play(Create(circle))
            self.wait(0.5)

        self.wait(1)

        self.play(FadeOut(hospitals), FadeOut(hospital_labels), FadeOut(students), FadeOut(student_labels))
        
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        
        hospitals_phase = VGroup(*[Square(side_length=1).shift(LEFT * 2 + UP * i) for i in range(3)])
        hospital_labels_phase = VGroup(*[Text(f"Hospital {i+1}").scale(0.4).move_to(hospitals_phase[i].get_center()) for i in range(3)])
        self.play(Create(hospitals_phase), Write(hospital_labels_phase))
        
        students_phase = VGroup(*[Circle(radius=0.25).shift(RIGHT * 2 + UP * i) for i in range(3)])
        student_labels_phase = VGroup(*[Text(f"Student {i+1}").scale(0.4).move_to(students_phase[i].get_center()) for i in range(3)])
        self.play(Create(students_phase), Write(student_labels_phase))
        
        self.wait(1)

        for i in range(3):
            circle = Circle(radius=0.5)
            self.play(Create(circle))
            self.wait(0.5)

        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        self.wait(6.6)  # Adjust to make total duration 33.6 seconds