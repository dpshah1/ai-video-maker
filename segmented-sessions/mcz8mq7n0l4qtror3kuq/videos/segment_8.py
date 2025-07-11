from manim import *

class ResidencyMatchScene(Scene):
    def construct(self):

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        timeline = Line(start=LEFT * 6, end=RIGHT * 6).shift(DOWN * 1)
        self.play(ShowCreation(timeline))

        years = [Text("1952").shift(LEFT * 5.5 + DOWN * 1.5),
                 Text("1997").shift(LEFT * 2.5 + DOWN * 1.5),
                 Text("2012").shift(RIGHT * 2.5 + DOWN * 1.5)]
        milestones = [Text("First Match").shift(LEFT * 5.5 + UP * 0.5),
                      Text("Chaos of Early Offers").shift(LEFT * 2.5 + UP * 0.5),
                      Text("Propose-and-Reject Algorithm").shift(RIGHT * 2.5 + UP * 0.5)]
        
        for year, milestone in zip(years, milestones):
            self.play(Write(year), Write(milestone))
            self.wait(0.5)

        student_icon = Circle(radius=0.5).scale(0.5).shift(LEFT * 5 + DOWN * 2)
        hospital_icon = Circle(radius=0.5).scale(0.5).shift(RIGHT * 5 + DOWN * 2)
        
        self.play(FadeIn(student_icon), FadeIn(hospital_icon))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)

        self.play(FadeOut(student_icon), FadeOut(timeline), FadeOut(student_icon), FadeOut(hospital_icon))
        self.wait(1)

        self.wait(44.4 - self.time_elapsed)