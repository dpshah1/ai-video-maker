from manim import *

class ErrorAnimation(Scene):
    def construct(self):

        error_message = Text("Error processing multiple PDFs:", font_size=36)
        error_detail = Text("[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1", font_size=24)

        error_message.move_to(UP)
        error_detail.next_to(error_message, DOWN, buff=0.5)

        error_box = Rectangle(width=8, height=2, color=RED, stroke_width=0.5)
        error_box.move_to(DOWN)

        self.play(DrawBorderThenFill(error_box))
        self.play(Write(error_message))
        self.play(Write(error_detail))

        self.wait(4)