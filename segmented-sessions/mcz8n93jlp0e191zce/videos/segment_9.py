from manim import *

class DoesItAlwaysWork(Scene):
    def construct(self):
        title = Text("Does It Always Work?", font_size=72)
        subtitle = Text("Proving Termination and Stability", font_size=48)

        title.move_to(UP * 1.5)
        subtitle.next_to(title, DOWN, buff=0.5)

        background_rect = Rectangle(width=title.width + 1, height=title.height + 0.5, color=BLUE)
        background_rect.move_to(title.get_center())

        self.play(Create(background_rect))
        self.play(Write(title), Write(subtitle))

        self.wait(4.4)