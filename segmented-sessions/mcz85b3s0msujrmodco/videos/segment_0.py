from manim import *

class EducationalAnimation(Scene):
    def construct(self):

        title = Text("Understanding Fractions", font_size=72)
        title.set_color(BLUE)

        numerator = Text("1", font_size=48)
        denominator = Text("2", font_size=48)
        fraction_line = Line(LEFT, RIGHT).scale(0.5)
        fraction = VGroup(numerator, fraction_line, denominator).arrange(DOWN, buff=0.1)

        fraction.next_to(title, DOWN, buff=0.5)

        circle = Circle(radius=1.5, color=GREEN)
        filled_circle = Circle(radius=0.5, color=GREEN).scale(0.5)

        filled_circle.move_to(circle.get_center())

        self.play(Write(title))
        self.wait(0.5)
        self.play(ShowCreation(circle))
        self.wait(0.5)
        self.play(ShowCreation(filled_circle))
        self.wait(0.5)
        self.play(Write(fraction))
        self.wait(4.0)  # Wait to complete the 8 seconds

        self.clear()