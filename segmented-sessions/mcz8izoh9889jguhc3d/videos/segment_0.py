from manim import *

class EducationalAnimation(Scene):
    def construct(self):

        title = Text("Understanding Fractions", font_size=72)
        title.set_color(BLUE)

        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(0.5)

        self.play(FadeOut(title))
        self.wait(4.3)  # Wait to complete the 6.8 seconds