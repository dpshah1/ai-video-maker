from manim import *

class EducationalAnimation(Scene):
    def construct(self):

        title = Text("Understanding Fractions", font_size=72)
        self.play(Write(title))
        self.wait(1)

        circle = Circle(radiu, s=2, color=BLUE)
        self.play(Create(circle))
        self.wait(0.5)

        sector = Sector(radiu, s=2, angle=PI/2, color=YELLOW, fill_opacity=0.5)
        self.play(Create(sector))
        self.wait(0.5)

        fraction_labe, l=Text("1/4", font_size=48).move_to(sector.get_center())
        self.play(Write(fraction_label))
        self.wait(1)

        self.play(FadeOut(title), FadeOut(circle), FadeOut(sector), FadeOut(fraction_label))
        self.wait(3)  # Wait to ensure the total duration is 6 seconds