from manim import *

class DatingDilemma(Scene):
    def construct(self):
        title = Text("The Dating Dilemma… with Jobs", font_size=48)
        title.set_color(YELLOW)
        title.move_to(ORIGIN)

        self.play(Write(title))
        self.wait(3)